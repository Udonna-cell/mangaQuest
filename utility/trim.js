function trim(data,len){
  return data.split(" ").slice(0,len).join(" ") + "..."
}

module.exports = trim