
# import dependencies
import pandas as pd
from splinter import Browser
from bs4 import BeautifulSoup as bs
import time

def scrape():

    executable_path = {'executable_path': '/usr/local/bin/chromedriver'}
    browser = Browser('chrome', **executable_path, headless=False)
    news_url = 'https://mars.nasa.gov/news/'
    browser.visit(news_url)

    html = browser.html
    soup = bs(html, 'html.parser')

    news_title = soup.find('div', class_='content_title').text.strip()
    news_p = soup.find('div', class_='rollover_description_inner').text.strip()

    jpl_url = "https://www.jpl.nasa.gov/spaceimages/?search=&category=Mars"
    browser.visit(jpl_url)

    html = browser.html
    soup2 = bs(html, 'html.parser')

    browser.click_link_by_partial_text("FULL IMAGE")
    time.sleep(2)
    browser.click_link_by_partial_text('more info')

    image_html = browser.html
    soup3 = bs(image_html, 'html.parser')

    image_url = soup3.find('figure', class_='lede')
    image_url_back = image_url.a['href']

    featured_image_url = f'https://www.jpl.nasa.gov/{image_url_back}'

    weather_url = 'https://twitter.com/marswxreport?lang=en'
    browser.visit(weather_url)

    html = browser.html
    soup4 = bs(html, 'html.parser')



    tweet = soup4.find('div', class_='js-tweet-text-container').text.strip()
    mars_weather = tweet[8:-27]
    

    facts_url = 'https://space-facts.com/mars/'
    tables = pd.read_html(facts_url)



    df = tables[0]
    df.columns = ["Item", "Measurement"]
    df.set_index('Item', inplace=True)
    df.index.name=None

    df_html = df.to_html(header=False)


    hemi_url = 'https://astrogeology.usgs.gov/search/results?q=hemisphere+enhanced&k1=target&v1=Mars'
    browser.visit(hemi_url)

    html = browser.html
    soup5 = bs(html, 'html.parser')



    links = soup5.find_all('div', class_='item')

    links_list = []

    for i in links:
        links_list.append(i.h3.text)


    hemisphere_image_urls = []
    for i in links_list:
        image_dict={}
        try:
            browser.click_link_by_partial_text(i)
            time.sleep(1)
            image_dict['title'] = i
            
            html = browser.html
            soup6 = bs(html, 'html.parser')
            img_url = soup6.find('div', class_='downloads')
            
            image_dict['img_url'] = img_url.li.a['href']
            
            hemisphere_image_urls.append(image_dict)
            browser.back()
        except:
            break

    mars_data = {
        "news_title": news_title,
        "news_p": news_p,
        'mars_weather': mars_weather,
        "featured_image_url": featured_image_url,
        "df_html": df_html,
        'hemisphere_image_url': hemisphere_image_urls
    }

    browser.quit()

    return(mars_data)