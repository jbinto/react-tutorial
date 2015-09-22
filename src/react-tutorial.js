var data = [
  { author: "Jesse", text: "This is a comment." },
  { author: "billg", text: "This is *another* comment. It &lt;justworks&gt;, **even with HTML**." },
];

var CommentBox = React.createClass({
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.props.data} />
        <CommentForm />
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
          blah blah {comment.text}
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
  render: function() {
    return (
      <div className="commentForm">
        Hello world! I am a CommentForm.
      </div>
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
  <CommentBox data={data} />,
  document.getElementById('content')
);
