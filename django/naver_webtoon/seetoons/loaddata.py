import requests, json
from bs4 import BeautifulSoup
import os, dotenv
import pymysql.cursors

def insertsql_from_json():
    conn = pymysql.connect( 
            user = os.environ.get('USERNAME'),
            passwd = os.environ.get('PASSWORD'),
            host = 'localhost',
            port = 3306,
            db = 'seetoons',
            charset = 'utf8mb4'
    ) 
    curs = conn.cursor()

    url = 'https://comic.naver.com/webtoon/weekday'
    response = requests.get(url)

    if response.status_code == 200:
        html = response.text
        soup = BeautifulSoup(html, 'html.parser')
        result =[]
        daily_webtoon_list = soup.select('#content > div.list_area.daily_all > div.col')
        i = 0
        for w in daily_webtoon_list:
            day = w.select_one('div > h4 > span').text
            webtoons = w.select('div > ul > li')
            imgs = w.select('div > a > img')

            for img in imgs:
                data = {
                    'day':day,
                    'title':img.attrs['title'],
                    'img':img.attrs['src'],
                }
                result.append(data)

        with open('./data.json','w') as file:
            file.write(json.dumps(result))

        with open('./data.json') as file:
            json_data = json.load(file)
            for row in json_data:
                print(row)
                sql = "INSERT INTO `webtoons_webtoons`(day, title, img) VALUES (%s, %s, %s)"
                val =(row['day'], row['title'], row['img'])
                i += 1
                curs.execute(sql,val) 
                conn.commit()
        
    else:
        print(response.status_code)

dotenv.load_dotenv()
insertsql_from_json()   


