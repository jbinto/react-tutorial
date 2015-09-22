var CommentBox = React.createClass({
  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleCommentSubmit: function(comment) {
    // note: This is in CommentBox since it is the component responsible
    // for loading data. This would be called, indirectly, by CommentForm.

    // Pre-add the comment to comments, since POST takes some time
    // (artificially set to 2s for demo purposes)
    var comments = this.state.data;
    var newComments = comments.concat([comment]);
    this.setState({data: newComments});

    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    })
  },
  getInitialState: function() {
    return { data: [] };
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
    );
  }
});

var CommentList = React.createClass({
  render: function() {
    // e.g. an array of JSX-style <Comment> components
    var commentNodes = this.props.data.map(function(comment) {
      return (
        <Comment author={comment.author}>
          {comment.text}
        </Comment>
      );
    });

    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

var CommentForm = React.createClass({
  handleSubmit: function(e) {
    // Don't actually browser-submit the form. Let JS handle it.
    e.preventDefault();

    // Extract author/text from form...
    var author = React.findDOMNode(this.refs.author).value.trim();
    var text = React.findDOMNode(this.refs.text).value.trim();

    // Bail if either is empty...
    if (!text || !author) {
      return;
    }

    // Inform CommentBox component that we've submitted.
    this.props.onCommentSubmit({ author: author, text: text});

    // Clear the form.
    React.findDOMNode(this.refs.author).value = '';
    React.findDOMNode(this.refs.text).value = '';

    return;
  },
  render: function() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Name?" ref="author" />
        <input type="text" placeholder="Type some words here." ref="text" />
        <input type="submit" value="Post" />
      </form>
    );
  }
});


var Comment = React.createClass({
  render: function() {
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return (
      <div className="comment">
        <h2 className="commentAuthor">{this.props.author}</h2>
        <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
      </div>
    );
  }
});


React.render(
  <CommentBox url="comments.json" pollInterval="5000" />,
  document.getElementById('content')
);
