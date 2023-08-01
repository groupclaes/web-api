# list directories
for dir in ~/development/groupclaes/web-api/backend/*/
do
  # remove the trailing "/"
  dir=${dir%*/}
  
  # print directory
  echo "updating ${dir}"

  # change to dir
  cd ${dir}

  # run build script
  sh ./build.sh
done