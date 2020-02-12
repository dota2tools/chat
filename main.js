
languagePluginLoader.then(() => {
          
          document.getElementById("changetext-button").onclick = () => {
            pyodide.runPython(`
            from pyodide import open_url
            import js
            
            
            import json
            
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
            match_id_and_chat = dict()
            def info():
                for match_id, _ in match_player_slot.items():
                    r = open_url(
                        f"https://api.opendota.com/api/matches/{match_id}"
                    )
                    match_chat_json = json.loads(r.read())
                    match_id_and_chat[match_id] = match_chat_json["chat"]
            
            
            info()
            messages = dict()
            def search_for_player():
                for match_id, chat in match_id_and_chat.items():
                    if chat:
                        for message in chat:
                            if message["type"] == "chat":
                                try:
                                    if message["player_slot"] == match_player_slot[match_id]:
                                        try:
                                            messages[match_id] += [message["key"]]
                                        except KeyError:  # if not exists
                                            messages[match_id] = [message["key"]]
                                except:
                                    print("Key eror player slot")
            search_for_player()
            def get_result():
                clean = list()
                for _, message in messages.items():
                    clean.append(message)
                wall_of_text = f"<p>ID : {player_id} <br/> "
                for message in clean:
                    for clean_messages in message:
                        wall_of_text += clean_messages.lower() +"<br/>" # newline doesnt work
                wall_of_text += "<p>"
                return wall_of_text
            js.sometext.innerHTML += get_result()`);
          }
            });
      
