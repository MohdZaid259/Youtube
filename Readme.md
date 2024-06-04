# a backend megaproject - YouTube

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

5> cloudinary
. uploading in 2 steps, frontend - localstorage & localStorage to cloudinary
. configured cloudinary 
. wrote method in cloudinary to upload locally stored files
. deleted the residue in local storage
. configured multer
. wrote method in multer to upload files locally

6> routes
. configured router
. created a basic responding func 'registerUser' in controller
. wrote a get request in app.js & redirected to router
. redirected to registerUser if user wants to register
. checked on postman if we're getting the response or not