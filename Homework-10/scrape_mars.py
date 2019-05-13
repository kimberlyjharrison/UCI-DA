
# import dependencies
import pandas as pd
from splinter import Browser
from bs4 import BeautifulSoup as bs
import time

#define scrape function
def scrape():

    #set up splinter for mars news web scrape
    executable_path = {'executable_path': '/usr/local/bin/chromedriver'}
    browser = Browser('chrome', **executable_path, headless=False)
    news_url = 'https://mars.nasa.gov/news/'
    browser.visit(news_url)
    html = browser.html
    soup = bs(html, 'html.parser')

    #webscrape mars 
    news_title = soup.find('div', class_='content_title').text.strip()
    news_p = soup.find('div', class_='rollover_description_inner').text.strip()

    #splinter for jpl image scrape
    jpl_url = "https://www.jpl.nasa.gov/spaceimages/?search=&category=Mars"
    browser.visit(jpl_url)
    html = browser.html
    soup2 = bs(html, 'html.parser')

    #navigate jpl page to featured image
    browser.click_link_by_partial_text("FULL IMAGE")
    time.sleep(1)
    browser.click_link_by_partial_text('more info')

    #scrape image page for image url
    image_html = browser.html
    soup3 = bs(image_html, 'html.parser')
    image_url = soup3.find('figure', class_='lede')
    image_url_back = image_url.a['href']

    #save featured image url
    featured_image_url = f'https://www.jpl.nasa.gov/{image_url_back}'

    #splinter for mars weather scrape
    weather_url = 'https://twitter.com/marswxreport?lang=en'
    browser.visit(weather_url)
    html = browser.html
    soup4 = bs(html, 'html.parser')

    #scrape twitter for mars weather; remove hidden link at end of tweet to return string
    tweet = soup4.find('div', class_='js-tweet-text-container').text.strip()
    mars_weather = tweet[8:-27]
    
    #use pandas to scrape table data for mars facts
    facts_url = 'https://space-facts.com/mars/'
    tables = pd.read_html(facts_url)

    #convert table to data frame
    df = tables[0]
    df.columns = ["Item", "Measurement"]
    df.set_index('Item', inplace=True)
    df.index.name=None

    #convert dataframe to html string
    df_html = df.to_html(header=False)

    #splinter for hemisphere images
    hemi_url = 'https://astrogeology.usgs.gov/search/results?q=hemisphere+enhanced&k1=target&v1=Mars'
    browser.visit(hemi_url)
    html = browser.html
    soup5 = bs(html, 'html.parser')

    #scrape links
    links = soup5.find_all('div', class_='item')

    #initialize list to store link data
    links_list = []

    #loop through all links and store in list
    for i in links:
        links_list.append(i.h3.text)

    #initialize image url list
    hemisphere_image_urls = []

    #loop through each link in list and visit page; store info in dictionary
    for i in links_list:
        image_dict={}
        try:
            #store iamge title to dictionary
            image_dict['title'] = i

            #navigate through pages
            browser.click_link_by_partial_text(i)
            time.sleep(1)
            html = browser.html
            soup6 = bs(html, 'html.parser')

            #grab image url adn store in dict
            img_url = soup6.find('div', class_='downloads')
            image_dict['img_url'] = img_url.li.a['href']
            
            #add new dict to list of urls
            hemisphere_image_urls.append(image_dict)

            #return to previous page
            browser.back()
        except:
            break

    #store all scraped data in dictionary
    mars_data = {
        "news_title": news_title,
        "news_p": news_p,
        'mars_weather': mars_weather,
        "featured_image_url": featured_image_url,
        "df_html": df_html,
        'hemisphere_image_url': hemisphere_image_urls
    }

    #closer browser
    browser.quit()
    
    return(mars_data)