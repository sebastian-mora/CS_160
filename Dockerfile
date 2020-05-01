FROM node


WORKDIR /www/cs160

ADD package.json /www/cs160
RUN npm install

ADD . /www/cs160


# Entrypoint script
RUN cp docker-entrypoint.sh /usr/local/bin/ && chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]