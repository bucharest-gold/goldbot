FROM bucharestgold/centos7-s2i-nodejs:7.7.4

RUN yum install libicu-devel.x86_64 -y
RUN npm link ; \ 
    echo "{\"channel\": \"#foobarbar\"}" > bot-config.json ; \
    goldbot bot-config.json
