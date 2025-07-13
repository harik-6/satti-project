# from langchain_community.document_loaders import TextLoader
# from langchain_text_splitters import RecursiveCharacterTextSplitter
# from langchain_ollama import OllamaEmbeddings
# from langchain_chroma import Chroma
# from langchain_ollama import ChatOllama
# from sympy import resultant
#
# raw_document = TextLoader("./invesco.txt").load()
# text_splitter = RecursiveCharacterTextSplitter(chunk_size=50, chunk_overlap=5)
# documents = text_splitter.split_documents(raw_document)
# # print(len(documents))
# ollama_embeddings = OllamaEmbeddings(base_url="http://localhost:11434",model='nomic-embed-text')
# db = Chroma.from_documents(documents, embedding=ollama_embeddings)
# print("-----------------------------------------------------------")
# result = db.similarity_search("Expense ratio")
# # print(len(result))
# context = ""
# for i in result:
#     context += i.page_content + " "
# print(context)