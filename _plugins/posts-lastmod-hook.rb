#!/usr/bin/env ruby
#
# Check for changed posts

Jekyll::Hooks.register :posts, :post_init do |post|

  # An empty repository has no HEAD yet. Skip history lookup until the first
  # commit instead of printing a Git error during the initial local build.
  next unless system('git rev-parse --verify HEAD > /dev/null 2>&1')

  commit_num = `git rev-list --count HEAD "#{ post.path }"`

  if commit_num.to_i > 1
    lastmod_date = `git log -1 --pretty="%ad" --date=iso "#{ post.path }"`
    post.data['last_modified_at'] = lastmod_date
  end

end
