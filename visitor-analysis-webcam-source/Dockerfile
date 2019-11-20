FROM nginx
LABEL maintainer Justin Nguyen <tuan3.nguyen@gmail.com>

# Create app directory
WORKDIR /usr/share/nginx/html

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY build ./

# Timezone to Vietnam
ENV TZ=Asia/Bangkok
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone