import { useState } from 'react';

const NewBlogForm = ({ setBlogs, user }) => {
  const [newBlogTitle, setNewBlogTitle] = useState('');
  const [newBlogAuthor, setNewBlogAuthor] = useState('');
  const [newBlogUrl, setNewBlogUrl] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const blogObject = {
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl,
      user: user.id,
    };

    setBlogs(prevBlogs => prevBlogs.concat(blogObject))
    setNewBlogTitle('')
    setNewBlogAuthor('')
    setNewBlogUrl('')
  };

  return (
    <div className="form-container">
      <h2>Create New Blog</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input
            type="text"
            value={newBlogTitle}
            onChange={({ target }) => setNewBlogTitle(target.value)}
            required
          />
        </div>
        <div>
          <label>Author</label>
          <input
            type="text"
            value={newBlogAuthor}
            onChange={({ target }) => setNewBlogAuthor(target.value)}
            required
          />
        </div>
        <div>
          <label>URL</label>
          <input
            type="url"
            value={newBlogUrl}
            onChange={({ target }) => setNewBlogUrl(target.value)}
            required
          />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default NewBlogForm;
