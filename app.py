from flask import Flask, jsonify
from flask_cors import CORS  
import mysql.connector

#Cria a instância do aplicativo flask
app = Flask(__name__) 

#habilita CORS para solicitações de origens cruzadas (se necessario)
CORS(app)

#função para estabelecer uma conexão com o banco de dados MySQL
def conectar_banco():  
    mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        password="admin",
        database="bancos"  
    )
    return mydb

#função para fechar a conexão com o banco de dados MySQL
def fechar_conexao(mydb):  
    mydb.close()

#Manipulador de rota para listar todos os bancos(GET /bancos)
@app.route('/bancos', methods=['GET'])
def listar_bancos():
    mydb = conectar_banco()
    cursor = mydb.cursor(dictionary=True)  
    cursor.execute("SELECT * FROM bancos")
    bancos = cursor.fetchall()
    fechar_conexao(mydb)  

    return jsonify(bancos)

#Manipulador de rota para recuperar um banco especifico pelo seu codigo (GET /bancos/<int:codigo_compensacao>)
@app.route('/bancos/<int:codigo_compensacao>', methods=['GET'])
def consultar_banco(codigo_compensacao):
    mydb = conectar_banco()
    cursor = mydb.cursor(dictionary=True)  
    cursor.execute("SELECT * FROM bancos WHERE codigo_compensacao = %s", (codigo_compensacao,))
    banco = cursor.fetchone()  
    fechar_conexao(mydb) 

    if banco:
        return jsonify(dict(banco))
    else:
        return jsonify({"erro": "Banco não encontrado"}), 404  
#Executa o aplicativo flask"
if __name__ == '__main__':  
    app.run(debug=True)