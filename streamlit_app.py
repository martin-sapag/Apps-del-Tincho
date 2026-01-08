import streamlit as st
import google.generativeai as genai

# 1. Configuración de la página (Título e icono de la pestaña)
st.set_page_config(page_title="Finanzas IA", page_icon="💰")

# Título y descripción visible
st.title("💰 Asistente de Finanzas Familiares")
st.markdown("Ingresa tus datos mensuales y recibe una auditoría y consejos de ahorro personalizados con IA.")

# 2. Configuración de Seguridad (API Key)
try:
    if "GOOGLE_API_KEY" in st.secrets:
        genai.configure(api_key=st.secrets["GOOGLE_API_KEY"])
    else:
        st.error("⚠️ Falta la API Key en los Secrets.")
        st.stop()
except Exception as e:
    st.error(f"Error de configuración: {e}")

# Instanciamos el modelo rápido
model = genai.GenerativeModel('gemini-1.5-flash')

# 3. Formulario de Datos (Inputs para el usuario)
with st.container():
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("🟢 Ingresos")
        ingresos = st.number_input("Total Ingresos del Hogar ($)", min_value=0.0, step=100.0, format="%.2f")
    
    with col2:
        st.subheader("🔴 Gastos")
        gastos_fijos = st.number_input("Gastos Fijos (Alquiler, Luz, Internet)", min_value=0.0, step=100.0, format="%.2f")
        gastos_variables = st.number_input("Gastos Variables (Super, Salidas, Otros)", min_value=0.0, step=100.0, format="%.2f")

    # Calculadora rápida automática
    total_gastos = gastos_fijos + gastos_variables
    balance = ingresos - total_gastos
    
    st.info(f"📊 **Balance Preliminar:** Ingresan **${ingresos}** - Salen **${total_gastos}** = Quedan **${balance}**")

    # Texto libre para contexto
    objetivo = st.text_area("🎯 ¿Cuál es tu objetivo o preocupación principal?", placeholder="Ej: Queremos ahorrar para vacaciones, pero gastamos mucho en delivery. Tenemos una deuda de tarjeta de crédito...")

# 4. El Cerebro (Botón de Acción)
if st.button("🧠 Evaluar Finanzas con IA"):
    if ingresos == 0:
        st.warning("Por favor ingresa al menos los ingresos.")
    else:
        with st.spinner('Analizando patrones financieros...'):
            try:
                # Construimos el Prompt Financiero
                prompt_finanzas = f"""
                Actúa como un Asesor Financiero experto en economía familiar.
                Analiza la siguiente situación financiera:

                DATOS DEL MES:
                - Ingresos Totales: ${ingresos}
                - Gastos Fijos (Obligatorios): ${gastos_fijos}
                - Gastos Variables (Estilo de vida): ${gastos_variables}
                - Dinero restante (Cashflow): ${balance}
                
                CONTEXTO DEL USUARIO:
                "{objetivo}"

                TAREA:
                Por favor genera un reporte breve y directo con:
                1. **Diagnóstico**: ¿Está saludable la economía? (Usa emojis de semáforo).
                2. **Regla 50/30/20**: Compara cómo gastan vs cómo DEBERÍAN gastar teóricamente.
                3. **Plan de Acción**: 3 consejos concretos y numéricos para lograr su objetivo "{objetivo}".
                
                Usa formato Markdown, sé empático pero riguroso con los números.
                """

                # Llamada a Gemini
                response = model.generate_content(prompt_finanzas)
                
                # Resultado
                st.success("Reporte Generado:")
                st.markdown(response.text)
                
            except Exception as e:
                st.error(f"Error: {e}")

# Footer
st.divider()
st.caption("Herramienta de evaluación financiera asistida por Google Gemini")
st.caption("Creado por Martín Sapag usando Streamlit & Google AI")
