// -- promise --
const asyncHandler = (requestHandler) => {
  (req,res,next) => {
    Promise.resolve(requestHandler(req,res,next)).reject((err) => next(err))
  }
}

export {asyncHandler}

// const asyncHandler = (fn) => {}
// const asyncHandler = (fn) => () => {}
// const asyncHandler = (fn) => async () => {}

// -- tryCatch --
// const asyncHandler = (func) => async (req,res,next) => {
//   try {
//     await func(req,res,next)
//   } catch (err) {
//     res.status(err.code || 500).json({
//       success:false,
//       message:err.message
//     })
//   }
// }
