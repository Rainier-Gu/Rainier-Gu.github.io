FROM ruby:3.4-bookworm

ENV LANG=C.UTF-8 \
    BUNDLE_PATH=/usr/local/bundle \
    BUNDLE_JOBS=4 \
    BUNDLE_RETRY=3

RUN apt-get update \
    && apt-get install -y --no-install-recommends build-essential git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /workspaces/site

COPY Gemfile* ./
RUN bundle install

COPY . .

EXPOSE 4000 35729

CMD ["bash", "-lc", "bundle install && bundle exec jekyll serve --host 0.0.0.0 --port 4000 --livereload --force_polling"]
