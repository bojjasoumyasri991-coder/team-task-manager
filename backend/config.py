import os

class Config:
    SECRET_KEY = "secretkey"
    SQLALCHEMY_DATABASE_URI = "sqlite:///taskmanager.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = "jwt-secret-key"