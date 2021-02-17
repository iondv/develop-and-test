FROM alpine/git as iondv-git-develop-and-test
WORKDIR /var/www/applications
RUN git clone --quiet "https://github.com/iondv/develop-and-test.git" develop-and-test
#COPY ./.dockerignore /var/www/applications/develop-and-test/.dockerignore

FROM alpine/git as iondv-git-framework
WORKDIR /var
RUN git clone --branch russian --quiet "https://github.com/iondv/framework.git" www
#COPY ./.dockerignore /var/www/.dockerignore

FROM alpine/git as iondv-git-registry
WORKDIR /var
RUN git clone --branch russian --quiet "https://github.com/iondv/registry.git" registry
#COPY ./.dockerignore /var/registry/.dockerignore

FROM alpine/git as iondv-git-rest
WORKDIR /var
RUN git clone --branch russian --quiet "https://github.com/iondv/rest.git" rest
#COPY ./.dockerignore /var/registry/.dockerignore

FROM alpine/git as iondv-git-ionadmin
WORKDIR /var
RUN git clone --branch russian --quiet "https://github.com/iondv/ionadmin.git" ionadmin
#COPY ./.dockerignore /var/ionadmin/.dockerignore

FROM alpine/git as iondv-git-portal
WORKDIR /var
RUN git clone --branch russian --quiet "https://github.com/iondv/portal.git" portal
#COPY ./.dockerignore /var/portal/.dockerignore

FROM alpine/git as iondv-git-viewlib
WORKDIR /var
RUN git clone --branch russian --quiet "https://github.com/iondv/viewlib.git" viewlib
#COPY ./.dockerignore /var/viewlib/.dockerignore

#FROM node:10-slim as iondv-base-develop-and-test
FROM node:10 as iondv-base-develop-and-test
WORKDIR /var/www
COPY --from=iondv-git-framework /var/www .
COPY ./init.sh /var/www/init.sh
COPY ./setup.ini /var/www/config/setup.ini
COPY --from=iondv-git-ionadmin /var/ionadmin /var/www/modules/ionadmin
COPY --from=iondv-git-portal /var/portal /var/www/modules/portal
COPY --from=iondv-git-registry /var/registry /var/www/modules/registry
COPY --from=iondv-git-rest /var/rest /var/www/modules/rest
COPY --from=iondv-git-develop-and-test /var/www/applications/ /var/www/applications/
COPY --from=iondv-git-viewlib /var/viewlib /var/www/applications/viewlib
#COPY ./prepare-demo.sh /var/www/prepare-demo.sh
#RUN sh /var/www/prepare-demo.sh && rm -f /var/www/prepare-demo.sh
ENV NODE_PATH /var/www
RUN npm install -g node-gyp gulp
RUN npm install
RUN gulp build
#RUN rm -Rf /var/www/log && \
#rm -Rf /var/www/test && \
#rm -Rf /var/www/view/default/vendor && \
#rm -Rf /var/www/view/default/node_modules && \
#find /var/www/modules/*/view/ -name node_modules -maxdepth 1 -type d -exec rm -rf {} \; || : && \
#find /var/www/modules/*/view/*/ -name node_modules -maxdepth 1 -type d -exec rm -rf {} \; || : && \
#find /var/www/applications/*/themes/*/ -name node_modules -maxdepth 1 -type d -exec rm -rf {} \; || : && \
#find . -name .eslintrc.yml -type f -delete && \
#find . -name .eslintignore -type f -delete && \
#find . -name .editorconfig -type f -delete && \
#find . -name .tern-project -type f -delete && \
#find . -name .gitignore -type f -delete && \
#find . -name .git -type d -exec rm -rf {} \; || : && \
#find . -name .npmignore -type f -delete && \
#find . -name package-lock.json -type f -delete && \
#find . -name config.json.devel -type f -delete && \
#find . -name config.json.prod -type f -delete && \
#find . -name setup.ini.example -type f -delete && \
#find . -name docs -type d -exec rm -rf {} \; || : && \
#find . -name changelog -type f -delete
#COPY ./.dockerignore /var/www/.dockerignore

#FROM node:10-alpine3.11 as iondv-develop-and-test
#FROM node:10 as iondv-develop-and-test
#WORKDIR /var/www
#ENV NODE_PATH /var/www
#EXPOSE 8888
#COPY --from=iondv-base-develop-and-test /var/www/ /var/www/
#ENV WORKER_COUNT=2
CMD ["sh", "init.sh"]