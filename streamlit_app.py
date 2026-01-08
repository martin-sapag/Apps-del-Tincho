import streamlit as st
import google.generativeai as genai
import pandas as pd
import io

# 1. Configuración de página
st.set_page_config(page_title="Gestión Financiera AI", page_icon="📊", layout="wide")

st.title("📊 Gestor Financiero Inteligente")
st.markdown("Detalla tus ingresos y egresos en las tablas. La IA analizará los patrones y podrás exportar el reporte.")

# 2. Configuración API (Seguridad)
try:
    if "GOOGLE_API_KEY" in st.secrets:
        genai.configure(api_key=st.secrets["GOOGLE_API_KEY"])
    else:
        st.error("⚠️ Falta la API Key en los Secrets.")
        st.stop()
except Exception as e:
    st.error(f"Error de configuración: {e}")

# Modelo: Cambiamos a 'gemini-pro' para asegurar compatibilidad y evitar error 404
model = genai.GenerativeModel('gemini-pro')

# 3. Inicialización de Datos (Session State)
# Esto crea las tablas vacías si es la primera vez que entras
if 'df_ingresos' not in st.session_state:
    st.session_state.df_ingresos = pd.DataFrame(columns=["Descripción", "Categoría", "Monto", "Frecuencia"])
if 'df_egresos' not in st.session_state:
    st.session_state.df_egresos = pd.DataFrame(columns=["Descripción", "Categoría", "Monto", "Prioridad (Alta/Baja)"])

# 4. Columnas para las tablas
col_izq, col_der = st.columns(2)

with col_izq:
    st.subheader("🟢 Ingresos")
    # Tabla editable de Ingresos
    st.session_state.df_ingresos = st.data_editor(
        st.session_state.df_ingresos,
        num_rows="dynamic", # Permite agregar filas
        key="editor_ingresos",
        column_config={
            "Monto": st.column_config.NumberColumn(format="$%.2f"),
            "Categoría": st.column_config.SelectboxColumn(options=["Salario", "Honorarios", "Rentas", "Otros"])
        }
    )

with col_der:
    st.subheader("🔴 Egresos / Gastos")
    # Tabla editable de Egresos
    st.session_state.df_egresos = st.data_editor(
        st.session_state.df_egresos,
        num_rows="dynamic",
        key="editor_egresos",
        column_config={
            "Monto": st.column_config.NumberColumn(format="$%.2f"),
            "Categoría": st.column_config.SelectboxColumn(options=["Vivienda", "Alimentación", "Salud", "Transporte", "Ocio", "Deudas"]),
            "Prioridad (Alta/Baja)": st.column_config.CheckboxColumn(label="Es Vital?")
        }
    )

# 5. Cálculos en tiempo real
total_ingresos = st.session_state.df_ingresos["Monto"].sum()
total_egresos = st.session_state.df_egresos["Monto"].sum()
balance = total_ingresos - total_egresos

st.metric(label="Balance del Mes", value=f"${balance}", delta=f"Ahorro Potencial: {(balance/total_ingresos)*100 if total_ingresos > 0 else 0:.1f}%")

# 6. El Cerebro (Botón de IA)
st.divider()
col_ia, col_export = st.columns([2, 1])

analisis_ia = ""

with col_ia:
    if st.button("🧠 Auditar Finanzas con IA"):
        if total_ingresos == 0 and total_egresos == 0:
            st.warning("Carga algunos datos en las tablas primero.")
        else:
            with st.spinner('Gemini está analizando cada gasto...'):
                try:
                    # Convertimos las tablas a texto para que la IA las lea
                    csv_ingresos = st.session_state.df_ingresos.to_csv(index=False)
                    csv_egresos = st.session_state.df_egresos.to_csv(index=False)

                    prompt = f"""
                    Actúa como Analista Financiero Senior. Analiza los siguientes datos:
                    
                    TABLA INGRESOS:
                    {csv_ingresos}
                    
                    TABLA GASTOS:
                    {csv_egresos}
                    
                    BALANCE FINAL: ${balance}

                    Por favor, entrega un reporte estructurado:
                    1. 🩺 **Diagnóstico**: Detecta patrones peligrosos en los gastos.
                    2. ✂️ **Oportunidades de Recorte**: Indica qué gastos NO vitales se pueden reducir.
                    3. 📈 **Proyección**: Si siguen así, ¿qué pasará en 6 meses?
                    4. 💡 **Consejo experto**: Una acción concreta para mejorar este mes.
                    """
                    
                    response = model.generate_content(prompt)
                    analisis_ia = response.text
                    st.markdown(analisis_ia)
                    
                    # Guardamos el análisis para poder exportarlo
                    st.session_state['ultimo_analisis'] = analisis_ia

                except Exception as e:
                    st.error(f"Error de IA: {e}")

# 7. Botón de Exportar (Excel)
with col_export:
    st.write("### 📥 Descargar")
    if st.button("Preparar Archivo Excel"):
        # Crear un buffer en memoria
        output = io.BytesIO()
        writer = pd.ExcelWriter(output, engine='xlsxwriter')
        
        # Escribir las hojas
        st.session_state.df_ingresos.to_excel(writer, sheet_name='Ingresos', index=False)
        st.session_state.df_egresos.to_excel(writer, sheet_name='Gastos', index=False)
        
        # Si hay análisis, agregarlo en una hoja aparte
        if 'ultimo_analisis' in st.session_state:
            df_analisis = pd.DataFrame([st.session_state['ultimo_analisis']], columns=["Análisis IA"])
            df_analisis.to_excel(writer, sheet_name='Auditoria_IA', index=False)
            
        writer.close()
        processed_data = output.getvalue()
        
        st.download_button(
            label="Descargar Reporte Excel (.xlsx)",
            data=processed_data,
            file_name="Reporte_Finanzas.xlsx",
            mime="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
