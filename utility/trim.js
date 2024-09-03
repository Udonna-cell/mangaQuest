function trim(data,len){
 try {
  let plot = data.split(" ").slice(0,len).join(" ") + "..."
  return plot
 } catch (error) {
  return "Can't work on an empty stomach"
 }
}

module.exports = trim