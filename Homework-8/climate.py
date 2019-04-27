#################################################
# Import Dependencies
#################################################
import numpy as np
import datetime as dt

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify

#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///Resources/hawaii.sqlite")

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Save reference to the table
Measurement = Base.classes.measurement
Station = Base.classes.station

# Create our session (link) from Python to the DB
session = Session(engine)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Flask Routes
#################################################

#Set up homepage with all available routes
@app.route("/")
def home():
	return(
        f"Hawaii Climate API </br></br>"
		f"Available Routes:</br>"
		f"/api/v1.0/precipitation</br>"
		f"/api/v1.0/stations</br>"
		f"/api/v1.0/tobs</br>"
        f"</br>"
        f"For the following routes, enter a date in the form of 'YYYY-MM-DD':</br>"
		f'/api/v1.0/start_date</br>'
		f'/api/v1.0/start_date/end_date</br>'
	)

#Define preciptation route
@app.route("/api/v1.0/precipitation")
def percip():
    #query percipitation data
    results = session.query(Measurement.date, Measurement.prcp).all()

    #initialize list
    all_prcp=[]
    
    #create a list of key value pairs
    for date, prcp in results:
        prcp_dict = {}
        prcp_dict['date'] = date
        prcp_dict['prcp'] = prcp
        all_prcp.append(prcp_dict)  

    #return JSON of query
    return jsonify(all_prcp)

#Define station route
@app.route('/api/v1.0/stations')
def stations():

    #query station data
    sel = [Measurement.station, func.count(Measurement.date)]
    active_stations = session.query(*sel).group_by(Measurement.station).\
    order_by(func.count(Measurement.date).desc()).all()

    #initialize list
    stations = []

    #create a list of key, value pairs 
    for station, count in active_stations:
        station_dict = {}
        station_dict["Station Name"] = station
        station_dict['Measurement Count'] = count
        stations.append(station_dict)
    
    #return JSON of query
    return jsonify(stations)


@app.route("/api/v1.0/tobs")
def tobs():

    #grab last date from the datebase
    last_date = session.query(Measurement.date).order_by(Measurement.date.desc()).first()

    #slice date to integers of year, month, day for datetime cals
    for date in np.ravel(last_date):
        year = int(date[:4])
        month = int(date[5:7])
        day = int(date[8:10])

    #calculate one year ago from last date in datebase
    year_ago = dt.date(year, month, day) - dt.timedelta(days=365)

    #query results for tobs data
    results = session.query(Measurement.date, Measurement.station, Measurement.tobs).\
        filter(Measurement.date >= year_ago).order_by(Measurement.date).all()
    
    #initialize list
    tobs_list = []

    #create a list of key, value pairs 
    for date, station, tobs in results:
        tobs_dict = {}
        tobs_dict['Date'] = date
        tobs_dict['Station'] = station
        tobs_dict['Temerature Observation (F)'] = tobs
        tobs_list.append(tobs_dict)

    #return JSON of query    
    return jsonify(tobs_list)


@app.route('/api/v1.0/<start>')
def start_date(start):

    #grab last date from the datebase
    last_date = session.query(Measurement.date).order_by(Measurement.date.desc()).first()

    #slice date to integers of year, month, day for datetime cals
    for date in np.ravel(last_date):
        year = int(date[:4])
        month = int(date[5:7])
        day = int(date[8:10])

    #create string for end date
    end = f"{year}-{month}-{day}"

    #calculate temperature statistics for provided date
    calc_temp = session.query(func.min(Measurement.tobs), func.avg(Measurement.tobs), func.max(Measurement.tobs)).\
        filter(Measurement.date >= start).filter(Measurement.date <= end).all()

    #initialize list
    temps = [f'Temperature Statistics from: {start} to {end}']

    #create a list of key, value pairs 
    for tmin, tave, tmax in calc_temp:
        temp_dict = {}
        temp_dict['tmin'] = tmin
        temp_dict['tave'] = tave
        temp_dict['tmax'] = tmax
        temps.append(temp_dict)
    
    #return JSON of query
    return jsonify(temps)


@app.route('/api/v1.0/<start>/<end>')
def end_date(start, end):

    #calculate temperature statistics for provided date
    calc_temp = session.query(func.min(Measurement.tobs), func.avg(Measurement.tobs), func.max(Measurement.tobs)).\
        filter(Measurement.date >= start).filter(Measurement.date <= end).all()

    #initialize list
    temps = [f'Temperature Statistics from: {start} to {end}']

    #create a list of key, value pairs 
    for tmin, tave, tmax in calc_temp:
        temp_dict = {}
        temp_dict['tmin'] = tmin
        temp_dict['tave'] = tave
        temp_dict['tmax'] = tmax
        temps.append(temp_dict)

    #return JSON of query
    return jsonify(temps)

#flask debug mode
if __name__ == "__main__":
    app.run(debug=True)
