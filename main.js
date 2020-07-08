
languagePluginLoader.then(() => {       
pyodide.runPython(`
from pyodide import open_url
import js


import json
match_id_and_chat = dict()
match_chat_json = dict()
messages = dict()
old_m = None
c = 0

def btn_callback(event=None):
    print('click')
    player_id = int(js.user_id.value)
    r = open_url(
        f"https://api.opendota.com/api/players/{player_id}/recentMatches"
    )

    matches_json = r.read()
    matches_json = json.loads(matches_json)
    match_player_slot = dict()


    def ids():
        for r in matches_json:
            match_player_slot[r["match_id"]] = r["player_slot"]
    ids()
    def info():
        def fetchChat(match_id):
                def callback(data):
                    global match_chat_json
                    global match_id_and_chat
                    result = [dict(j) for j in data]
                    
                    for i in result:
                        #if i[0] == 'match_id':print('mathc id',i[1])
                        if i[0] =='chat':
                            #print('dict',dict(i))
                            if i[1] is not None:
                                dd = [dict(c) for c in i[1]]
                                match_chat_json[match_id] = dd
                                try:
                                   print('setting match id',match_id)
                                   print(match_chat_json,'-',match_id_and_chat)
                                   match_id_and_chat[match_id] = match_chat_json["chat"]
                                   print('len',len(match_chat_json["chat"]))
                                except KeyError:
                                   print('not found')
                 
                               
                for match_id in [match_id]:
                    url = f"https://api.opendota.com/api/matches/{match_id}"
                    fetchPromise = js.window.fetch(url)
                    fetchPromise.then(lambda resp: resp.json()).then(callback)

        for match_id in match_player_slot.keys():

            url = f"https://api.opendota.com/api/matches/{match_id}"   
            fetchChat(match_id)     
         


    info()
    def search_for_player():
        global old_m
        global c
        old_m = messages
        if old_m == messages:
            c += 1
            print(messages)
            if c>2:
                #print(messages)
                result = f'{player_id:*^30}<br>'
                for k,v in messages.items():
                    result += f'{k} {v} <br>'
                js.results_id.innerHTML += result
                c = 0
                
                stop()
        for match_id, chat in match_chat_json.items():       
            if chat:
                for message in chat:
                    if message["type"] == "chat":
                        try:
                            if message["player_slot"] == match_player_slot[match_id]:
                                try:
                                    if message["key"] not in messages[match_id]:
                                        messages[match_id] += (message["key"],)
                                except KeyError:  # if not exists
                                    messages[match_id] = (message["key"],)
                        except:
                            print("Key eror player slot")
    search_for_player()
    timer = js.window.setInterval(search_for_player,1000)
    def stop():
        global match_id_and_chat
        global chat_json
        global messages
        match_id_and_chat = dict()
        match_chat_json = dict()
        messages = dict()
        js.window.clearInterval(timer)
js.document.querySelector("#start_btn").onclick = btn_callback
`);});
      
