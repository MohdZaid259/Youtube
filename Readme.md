# a backend megaproject - YouTube

1) file setup, dependencies, libraries

-- -- -- -- -- Flow -- -- -- -- -- 

1> index.js 
. fetches evns using dotenv
. took dbName from constant.js
. connects db using method written in db 
. applies onError & listen on app imported from app.js

2> app.js
. created app from express
. configured cors for accessing database
. configured app for fetching data sent in different ways
. configured cookieParser
. added route

3> utils
. strandarised errors using constructor
. strandarised response using constructor
. wrote a wrapper asyncHandler for all async methods

4> models
. wrote user, video model 
. encrypted, compared password using bcrypt
. generated accessToken, refreshToken using jsonwebtoken
. added a plugin mongooseAggregatePaginate in video model