 curl --request GET \
  --url 'https://api.example.com/api/profiles?profile_group_id=zj3F5b' \          --header 'Authorization: Bearer b462a94e99a50ffbe87c9f72fc668049027ac1cb197b31c0'
curl: (6) Could not resolve host: api.example.com

sourav@DESKTOP-0H2OE99 MINGW64 /d
$  curl --request GET \
  --url 'https://api.postproxy.dev/api/profiles?profile_group_id=zj3F5b' \          --header 'Authorization: Bearer b462a94e99a50ffbe87c9f72fc668049027ac1cb197b31c0'
{"data":[]}curl: (3) URL rejected: Malformed input to a URL function

sourav@DESKTOP-0H2OE99 MINGW64 /d
$ curl -X GET "https://api.postproxy.dev/api/profiles" \
  -H "Authorization: Bearer b462a94e99a50ffbe87c9f72fc668049027ac1cb197b31c0"
{"data":[]}
sourav@DESKTOP-0H2OE99 MINGW64 /d
$ curl -X GET "https://api.postproxy.dev/api/profiles" \
  -H "Authorization: Bearer b462a94e99a50ffbe87c9f72fc668049027ac1cb197b31c0"
{"data":[]}
sourav@DESKTOP-0H2OE99 MINGW64 /d
$  curl -X GET "https://api.postproxy.dev/api/profiles" \
  -H "Authorization: Bearer b462a94e99a50ffbe87c9f72fc668049027ac1cb197b31c0"
{"data":[{"id":"R3VUlL","name":"Ben Woods","platform":"facebook","status":"activ
e","profile_group_id":"zgYFg9","expires_at":null,"post_count":0}]}
sourav@DESKTOP-0H2OE99 MINGW64 /d
$ curl -X GET "https://api.postproxy.dev/api/profile_groups" \
     -H "Authorization: Bearer b462a94e99a50ffbe87c9f72fc668049027ac1cb197b31c0"
{"data":[{"id":"zj3F5b","name":"dssds","profiles_count":0},{"id":"zgYFg9","name"
:"Default","profiles_count":1}]}
sourav@DESKTOP-0H2OE99 MINGW64 /d
$ curl -X GET "https://api.postproxy.dev/api/profiles" \
  -H "Authorization: Bearer b462a94e99a50ffbe87c9f72fc668049027ac1cb197b31c0"
{"data":[]}
sourav@DESKTOP-0H2OE99 MINGW64 /d
$ curl -X GET "https://api.postproxy.dev/api/profiles?profile_group_id=qwkFvP" -H "Authorization: Bearer 55b1e896d5b602f79bfee7dec6c7b284d0d26b89780c21a5"      {"data":[{"id":"NQoUAY","name":"Sourav Maji","platform":"facebook","status":"act
ive","profile_group_id":"qwkFvP","expires_at":null,"post_count":0}]}
sourav@DESKTOP-0H2OE99 MINGW64 /d
$ curl -X GET "https://api.postproxy.dev/api/profiles?profile_group_id=KOGFwo" -H "Authorization: Bearer 55b1e896d5b602f79bfee7dec6c7b284d0d26b89780c21a5"
{"data":[{"id":"yJzUYr","name":"Ben Woods","platform":"facebook","status":"activ
e","profile_group_id":"KOGFwo","expires_at":null,"post_count":1}]}
sourav@DESKTOP-0H2OE99 MINGW64 /d
$ curl -X GET "https://api.postproxy.dev/api/profiles/NQoUAY/placements" \
     -H "Authorization: Bearer b462a94e99a50ffbe87c9f72fc668049027ac1cb197b31c0"
{"error":"Not found. Make sure you pass the correct profile_group_id"}
sourav@DESKTOP-0H2OE99 MINGW64 /d
$ curl -X GET "https://api.postproxy.dev/api/profiles/qwkFvP/placements" \
     -H "Authorization: Bearer b462a94e99a50ffbe87c9f72fc668049027ac1cb197b31c0"
{"error":"Not found. Make sure you pass the correct profile_group_id"}
sourav@DESKTOP-0H2OE99 MINGW64 /d
$ curl -X GET "https://api.postproxy.dev/api/profiles/qwkFvP/placements" \
     -H "Authorization: Bearer 55b1e896d5b602f79bfee7dec6c7b284d0d26b89780c21a5"
{"error":"Not found. Make sure you pass the correct profile_group_id"}
sourav@DESKTOP-0H2OE99 MINGW64 /d
$ curl -X GET "https://api.postproxy.dev/api/profiles?profile_group_id=qwkFvP/placements" \                                                                          -H "Authorization: Bearer 55b1e896d5b602f79bfee7dec6c7b284d0d26b89780c21a5"
{"error":"Invalid API key or profile group. Be sure to check that you are using
the correct id and not name"}
sourav@DESKTOP-0H2OE99 MINGW64 /d
$ curl -X GET "https://api.postproxy.dev/api/profiles/NQoUAY/placements" \
  -H "Authorization: Bearer 55b1e896d5b602f79bfee7dec6c7b284d0d26b89780c21a5"
{"error":"Not found. Make sure you pass the correct profile_group_id"}
sourav@DESKTOP-0H2OE99 MINGW64 /d
$ curl -X GET "https://api.postproxy.dev/api/profiles/NQoUAY/placements?profile_group_id=qwkFvP" \
  -H "Authorization: Bearer 55b1e896d5b602f79bfee7dec6c7b284d0d26b89780c21a5"
{"data":[{"id":"931198253419940","name":"Cosmic Blast"},{"id":"1062610726929883"
,"name":"Guwahati Old Steel Furniture Repair"},{"id":"992264450638548","name":"s
undarshalini"},{"id":"112250648213125","name":"Learntechweb"},{"id":"11041101827
0713","name":"NFT Learners"},{"id":"103641718780441","name":"Buy guwahati land"}
,{"id":"674071206356893","name":"Guwahati Furniture shop"}]}
sourav@DESKTOP-0H2OE99 MINGW64 /d
$ curl -X GET "https://api.postproxy.dev/api/profiles/yJzUYr/placements?profile_group_id=KOGFwo" \
  -H "Authorization: Bearer 55b1e896d5b602f79bfee7dec6c7b284d0d26b89780c21a5"
{"data":[{"id":"649547248242357","name":"MovieMania"}]}
sourav@DESKTOP-0H2OE99 MINGW64 /d
$
