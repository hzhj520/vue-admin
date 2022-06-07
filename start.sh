git pull origin
export VERSION=0.4
export NAME=efficacy-forntend
docker rm -f $NAME
docker build -t $NAME:$VERSION .
sleep 5
docker run -it -d --name $NAME -p 80:80 $NAME:$VERSION
