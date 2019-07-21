from flask import Flask, render_template, redirect
from flask_pymongo import PyMongo
import scrape_mars

app = Flask(__name__)

# Use flask_pymongo to set up mongo connection
mongo = PyMongo(app, uri="mongodb://localhost:27017/mars_app")

#create index page
@app.route("/")
def index():
    #pull data from mongodb
    mars_data = mongo.db.collection.find_one()
    
    #render html template
    return render_template("index.html", mars=mars_data)

#create scrape route
@app.route("/scrape")
def scraper():
    #call scraping function
    mars_data = scrape_mars.scrape()

    #add to mongodb
    mongo.db.collection.update({}, mars_data, upsert=True)

    return redirect("/", code=302)


if __name__ == "__main__":
    app.run(debug=True)
