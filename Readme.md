--flow--
git init makes package.json
add readme
public/temp/.gitkeep
.gitignore (paste from gitignore generators)
.env
src/ touch-app.js,index.js,constants.js
i nodemon
setup nodemon in package.json
src/ mkdir-controllers,db,middlewares,models,routes,utils
i prettier
setup prettier
npm i express mongoose dotenv
setup dotenv src/index.js
went mongodb, did setup get uri & pasted in .env
code for dbConnection in db/index.js
call for dbConnection in src/index.js
create an express app in src/app.js
npm i cookie-parser cors
create asyncHandler for future utility
write ApiError & ApiResponse in utils for standard response everytime
write user-video.model.js 
npm i mongoose-aggregate-paginate-v2 to write pipelines
npm i bcrypt to validate encrypted passwords
npm i jwt for tokens
wrote 'pre' middleware in user.model.js to encrypt password whenever it's updated
wrote a method 'isPasswordCorrect' to check password given is the same as stored in db
wrote a method 'generateAccessToken' to create AccessToken
wrote a method 'generateRefreshToken' to create RefreshToken
npm i cloudinary multer
multer - picks files & puts into localServer
cloudinary - picks file from localServer & puts into cloudinary
code for cloudinary for file upload to cloudinary
code for multer for file upload to localServer