export VERSION=0.4
docker build -t efficacy-forntend:$VERSION .
sleep 5
docker run -it -d --name efficacy-forntend -p 80:80 efficacy-forntend:$VERSION