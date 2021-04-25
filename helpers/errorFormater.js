module.exports.vErrorsMessageFormatter = (Verrors) => {       //formats verror message
    let errors = Object.entries(Verrors)
    errorsFormatted = errors.map(h => h[1].message)
    return errorsFormatted
}


module.exports.duplicateMessageFormatter = (message)=>{
    const messagePolish = Object.entries(message)[0][0]
    return `${messagePolish} already exists!`
}