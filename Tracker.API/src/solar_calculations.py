# src/solar_calculations.py

import pandas as pd
import pvlib

def calculate_tracker_angles(latitude, longitude, altitude, tz, axis_tilt, axis_azimuth, max_angle, reposo_tracker, start, end):
    # Criando um índice de tempo para um dia inteiro
    times = pd.date_range(start=start, end=end, freq='5min', tz=tz)

    # Obtendo a posição do sol
    solpos = pvlib.solarposition.get_solarposition(times, latitude, longitude, altitude=altitude)
    zenith = solpos['zenith']
    azimuth = solpos['azimuth']

    print("Zenith values:", zenith)  # Debug: veja os valores de zenith

    # Calculando a posição do tracker com backtracking
    tracker_angles = pvlib.tracking.singleaxis(
        apparent_zenith=zenith,
        apparent_azimuth=azimuth,
        axis_tilt=axis_tilt,
        axis_azimuth=axis_azimuth,
        max_angle=max_angle,
        backtrack=True,
        gcr=0.3014
    )

    # Verifique se os ângulos do tracker estão sendo calculados corretamente
    print("Tracker angles:", tracker_angles)  # Debug: veja os ângulos do tracker

    # Preenchendo valores fora de geração (zenith > 90°) com valor fixo de repouso
    tracker_theta = tracker_angles['tracker_theta'].copy()
    tracker_theta[zenith > 90] = reposo_tracker

    # Criando DataFrame
    df = pd.DataFrame({
        'timestamp': times,
        'zenith': zenith.values,
        'azimuth': azimuth.values,
        'tracker_theta': tracker_theta.values
    })

    return df    # Criando um índice de tempo para um dia inteiro
    times = pd.date_range(start=start, end=end, freq='5min', tz=tz)

    # Obtendo a posição do sol
    solpos = pvlib.solarposition.get_solarposition(times, latitude, longitude, altitude=altitude)
    zenith = solpos['zenith']
    azimuth = solpos['azimuth']

    # Calculando a posição do tracker com backtracking
    tracker_angles = pvlib.tracking.singleaxis(
        apparent_zenith=zenith,
        apparent_azimuth=azimuth,
        axis_tilt=axis_tilt,
        axis_azimuth=axis_azimuth,
        max_angle=max_angle,
        backtrack=True,
        gcr=0.3014
    )

    # Preenchendo valores fora de geração (zenith > 90°) com valor fixo de repouso
    tracker_theta = tracker_angles['tracker_theta'].copy()
    tracker_theta[zenith > 90] = reposo_tracker

    # Criando DataFrame
    df = pd.DataFrame({
        'timestamp': times,
        'zenith': zenith.values,
        'azimuth': azimuth.values,
        'tracker_theta': tracker_theta.values
    })

    return df