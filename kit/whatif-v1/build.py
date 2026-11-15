import json
tl = open("timeline.json", encoding="utf-8").read()
open("index.html", "w", encoding="utf-8").write(open("page.html", encoding="utf-8").read().replace("/*TIMELINE*/null", tl)); print("index.html")
