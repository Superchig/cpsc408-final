import streamlit as st

from sqlite3 import connect

DATABASE = "database.db"

db = connect(DATABASE)

st.markdown("# Transactions")

st.markdown("""
            Hello
            - First item
            - Second
            """)

records = 0

button = st.button("add")

if button:
    records += 1

st.write("Records:", records)

# https://docs.streamlit.io/library/api-reference/control-flow/st.form
# https://docs.streamlit.io/library/api-reference/widgets/st.text_input
# https://stackoverflow.com/questions/72409860/streamlit-autocomplete-from-list-of-values
with st.form("my_form"):
    st.write("Inside the form")
    slider_val = st.slider("Form slider")

    account_1 = st.text_input("account 1")

    submitted = st.form_submit_button("Submit")
    if submitted:
        st.write("slider", slider_val, "checkbox")

db.close()
