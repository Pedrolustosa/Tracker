# app.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # Importando o middleware CORS
from pydantic import BaseModel
import pandas as pd
import pvlib

app = FastAPI()

# Configurando o CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir todas as origens (pode ser ajustado)
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos os métodos (GET, POST, etc.)
    allow_headers=["*"],  # Permitir todos os cabeçalhos
)

class TrackerRequest(BaseModel):
    latitude: float
    longitude: float
    start: str  # Formato: 'YYYY-MM-DD HH:MM'
    end: str    # Formato: 'YYYY-MM-DD HH:MM'
    altitude: float = 254  # Valor padrão
    tz: str = 'America/Fortaleza'  # Valor padrão
    axis_tilt: float = 0  # Valor padrão
    axis_azimuth: float = 180  # Valor padrão
    max_angle: float = 55  # Valor padrão
    reposo_tracker: float = 0  # Valor padrão
    gcr: float = 0.3014  # Valor padrão

@app.post("/api/tracker_angles")
def get_tracker_angles(request: TrackerRequest):
    # Criando um índice de tempo para o período especificado
    times = pd.date_range(start=request.start, end=request.end, freq='5min', tz=request.tz)

    # Obtendo a posição do sol
    solpos = pvlib.solarposition.get_solarposition(times, request.latitude, request.longitude, altitude=request.altitude)
    zenith = solpos['zenith']
    azimuth = solpos['azimuth']

    # Calculando a posição do tracker com backtracking
    tracker_angles = pvlib.tracking.singleaxis(
        apparent_zenith=zenith,
        apparent_azimuth=azimuth,
        axis_tilt=request.axis_tilt,
        axis_azimuth=request.axis_azimuth,
        max_angle=request.max_angle,
        backtrack=True,
        gcr=request.gcr  # Usando o valor de gcr passado pelo usuário
    )

    # Preenchendo valores fora de geração (zenith > 90°) com valor fixo de repouso
    tracker_theta = tracker_angles['tracker_theta'].copy()
    tracker_theta[zenith > 90] = request.reposo_tracker

    # Criando DataFrame
    df = pd.DataFrame({
        'timestamp': times,
        'zenith': zenith.values,
        'azimuth': azimuth.values,
        'tracker_theta': tracker_theta.values
    })

    # Formatando os valores numéricos no padrão brasileiro
    df_formatado = df.copy()
    for col in ['zenith', 'azimuth', 'tracker_theta']:
        df_formatado[col] = df_formatado[col].map(
            lambda x: f"{x:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".") if pd.notna(x) else ""
        )

    # Substituindo qualquer NaN por string vazia
    df_formatado = df_formatado.fillna('')

    # Retornar os dados formatados como JSON
    return df_formatado.to_dict(orient='records')

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)