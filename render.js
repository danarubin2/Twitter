$(document).ready(() => {
    loadTweets();
    $("#makeTweetButton").on('click', function(event){
        handleMakeTweetButtonPress(event);
    })
});

let blankMessage = true;
let tweets = [];

const handleTweetButtonPress = function(event){
    let tweetDiv = $("#tweetText");
    let tweet = tweetDiv.val();
    let outer = $("#tweet");
    
    if (tweet == ''){
        if (blankMessage){
            outer.append(`<p id="blank">Please put something in the tweet box!</p>`);
            blankMessage = false;
        }
    }
    else{
        let tweetsDiv = $("#tweets");
        tweetsDiv.empty();
        axios({
            method: 'post',
            url: 'https://comp426fa19.cs.unc.edu/a09/tweets',
            withCredentials: true,
            data: {
              body: tweet
            },
        })
        .then(response => {
            let tweetsDiv = $("#tweets");
            tweetsDiv.empty();
            loadTweets();
        })
        .catch(error =>
            console.log(error)
        )
    
        tweetDiv = $("#tweet");
        tweetDiv.empty();
        tweetDiv.append(`
            <h3 class="subtitle">Have anything to say?</h3>
            <button type ="submit" class="button is-info" id="makeTweetButton">Click to make tweet!</button>
        `);
        $("#makeTweetButton").on('click', function(event){
            handleMakeTweetButtonPress(event);
        })
        blankMessage = true;
    }
}

const handleMakeTweetButtonPress = function(event){
    let tweetDiv = $("#tweet");
    tweetDiv.empty();
    tweetDiv.append(`
        <div class="field">
            <div class="control">
                <textarea class="textarea is-info" placeholder="Write your tweet here!" rows="5" id="tweetText"></textarea>
                <hr class="has-background-white">
                <button type ="submit" class="button is-danger" id="cancelTweetButton">Cancel</button>    
                <button type ="submit" class="button is-info is-pulled-right" id="tweetButton">Tweet</button>
            </div>
        </div>
    `);
    $("#tweetButton").on('click', function(event){
        handleTweetButtonPress(event);
    })
    $("#cancelTweetButton").on('click', function(event){
        handleCancelTweetPress(event);
    })
}

const handleCancelTweetPress = function(event){
    let tweetDiv = $("#tweet");
    tweetDiv.empty();
    tweetDiv.append(`
        <h3 class="subtitle">Have anything to say?</h3>
        <button type ="submit" class="button is-info" id="makeTweetButton">Click to make tweet!</button>
    `);
    $("#makeTweetButton").on('click', function(event){
        handleMakeTweetButtonPress(event);
    })
    blankMessage = true;
}

const handleEditButtonPress = function(event){
    let tweetDiv = $(event.target).parent();
    let id = tweetDiv.attr('id').substring(1);
    let urlString = 'https://comp426fa19.cs.unc.edu/a09/tweets/' + id;
    let tweet = tweets.find(t => (t.id) == id);
    let body;
    let parent;
    if (tweet.type == "retweet"){
        parent = tweet.parent;
        let length = ("Retweet from @" + parent.author + " "  + parent.body).length; 
        body = tweet.body.substring(23, tweet.body.length - length - 58);
    }else{
        body = tweet.body;
    }
    tweetDiv.empty();
    tweetDiv.append(
        `
        <div class="editDiv">
            <div class="field">
                <div class="control">
                    <textarea class="textarea editBox is-info" rows="5">${body}</textarea>
                    <hr class="has-background-white">
                    <button type ="submit" class="cancelEdit button is-danger">Cancel</button>
                    <button type ="submit" class="submitEdit button is-info is-pulled-right">Submit</button>    
                </div>
            </div>
        </div>
        `
    )
    $(".submitEdit").on('click', function(event){
        let message;
        if (tweet.type == "retweet"){
            let newTweet = $(".editBox").val();
            message = `<div class="rtText"><p>${newTweet}</p><br></div><p class="has-text-weight-light">Retweet from @ ${parent.author}</p><p>${parent.body}</p>`
        }else{
            message = $(".editBox").val()
        }
        handleEditSubmitButtonPress(event, message, id)
    })
    $(".cancelEdit").on('click', function(event){
        handleCancelEditButtonPress(event);
    })
}

const handleEditSubmitButtonPress = function(event, newTweet, id){
    let urlString = 'https://comp426fa19.cs.unc.edu/a09/tweets/' + id;
    axios({
        method: 'put',
        url: urlString,
        withCredentials: true,
        data: {
          body: newTweet
        },
    })
    .then(response =>{
        let tweetsDiv = $("#tweets");
        tweetsDiv.empty();
        loadTweets();
    })
    .catch(error => {
        console.log(error);
    }) 
}

const handleCancelEditButtonPress = function(event){
    let tweetsDiv = $("#tweets");
    tweetsDiv.empty();
    loadTweets();
}

const handleLikeButtonPress = function(event){
    let tweetDiv = $(event.target).parent();
    let id = tweetDiv.attr('id').substring(1);
    let urlString = 'https://comp426fa19.cs.unc.edu/a09/tweets/' + id + '/like'
    axios({
        method: 'put',
        url: urlString,
        withCredentials: true,
    })
    .then(response => {
        let button = $(event.target);
        button.replaceWith(
        `<button type="submit" class="like button is-danger">${"Unlike"}</button>`
        )
        let tweetsDiv = $("#tweets");
        tweetsDiv.empty();
        loadTweets();
    })
    .catch(error => {
        console.log(error);
    })
}

const handleUnlikeButtonPress = function(event){
    let tweetDiv = $(event.target).parent();
    let id = tweetDiv.attr('id').substring(1);
    let urlString = 'https://comp426fa19.cs.unc.edu/a09/tweets/' + id + '/unlike'
    axios({
        method: 'put',
        url: urlString,
        withCredentials: true,
    })
    .then(response => {
        let button = $(event.target);
        button.replaceWith(
        `<button type="submit" class="like button is-danger">${"Like"}</button>`
        )
        let tweetsDiv = $("#tweets");
        tweetsDiv.empty();
        loadTweets();
    })
    .catch(error => {
        console.log(error);
    })
}

const handleDeleteButtonPress = function(event){
    let tweetDiv = $(event.target).parent();
    let id = tweetDiv.attr('id').substring(1);
    let urlString = 'https://comp426fa19.cs.unc.edu/a09/tweets/' + id;
    axios({
        method: 'delete',
        url: urlString,
        withCredentials: true,
    })
    .then(response => {
        let tweetsDiv = $("#tweets");
        tweetsDiv.empty();
        loadTweets();
    })
    .catch(error => {
        console.log(error);
    })
}

const handleReplyButtonPress = function(event){
    let tweetDiv = $(event.target).parent();
    let id = tweetDiv.attr('id').substring(1);
    tweetDiv.append(
        `
        <div class="replyDiv">
            <hr class="has-background-white">
            <div class="field">
                <div class="control">
                    <textarea class="textarea replyBox is-info" placeholder="Write your reply here!" rows="5"></textarea>
                    <hr class="has-background-white">
                    <button type ="submit" class="cancelReply button is-danger">Cancel</button>    
                    <button type ="submit" class="submitReply button is-info is-pulled-right">Submit</button>
                </div>
            </div>
        </div>
        `
    )
    $(".submitReply").on('click', function(event){
        let reply = $(".replyBox").val();
        handleReplyButtonSubmit(event, id, reply);
    })
    $(".cancelReply").on('click', function(event){
        handleCancelReplyButtonPress(event);
    })
}

const handleReplyButtonSubmit = function(event, id, reply){
    axios({
        method: 'post',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets',
        withCredentials: true,
        data: {
          "type": "reply",
          "parent": id,
          "body": "Reply: " + reply
        },
    })
    .then(response => {
        let tweetsDiv = $("#tweets");
        tweetsDiv.empty();
        loadTweets();
    })
    .catch(error => {
        console.log(error);
    })
}

const handleCancelReplyButtonPress = function(event){
    let replyDiv = $(".replyDiv");
    replyDiv.empty();
}

const handleRetweetButtonPress = function(event){
    let tweetDiv = $(event.target).parent();
    let id = tweetDiv.attr('id').substring(1);
    tweetDiv.append(
        `
        <div class="retweetDiv">
            <hr class="has-background-white">
            <div class="field">
                <div class="control">
                    <textarea class="textarea retweetBox is-info" placeholder="Add what you want to the retweet here!" rows="5"></textarea>
                    <hr class="has-background-white">
                    <button type ="submit" class="cancelRetweet button is-danger">Cancel</button>    
                    <button type ="submit" class="submitRetweet button is-info is-pulled-right">Submit</button>
                </div>
            </div>
        </div>
        `
    )
    $(".submitRetweet").on('click', function(event){
        let retweet = $(".retweetBox").val();
        handleRetweetButtonSubmit(event, id, retweet);
    })
    $(".cancelRetweet").on('click', function(event){
        handleCancelRetweetButtonPress(event);
    })
}

const handleRetweetButtonSubmit = function(event, id, retweet){
    let original = tweets.find(t => (t.id) == id);
    let body = 
    `<div class="rtText"><p>${retweet}</p><br></div><p class="has-text-weight-light">Retweet from @ ${original.author}</p><p>${original.body}</p>`
    axios({
        method: 'post',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets',
        withCredentials: true,
        data: {
            "type": "retweet",
            "parent": id,
            "body": body
        },
    })
    .then(response => {
        let tweetsDiv = $("#tweets");
        tweetsDiv.empty();
        loadTweets();
    })
    .catch(error => {
        console.log(error);
    })
}

const handleCancelRetweetButtonPress = function(event){
    let retweetDiv = $(".retweetDiv");
    retweetDiv.empty();
}

const loadTweets = () => {
    tweets = [];
    axios({
        method: 'get',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets',
        withCredentials: true,
    })
    .then(response => {
            let tweetsDiv = $("#tweets");
            for (let i = 0; i < 50; i++){
                tweets.push(response.data[i]);
                let liked = response.data[i].isLiked;
                let likeButton;
                let editButton = ``;
                let deleteButton = ``;
                if (liked){
                    likeButton = `<button type="submit" class="like button is-danger">${"Unlike"}</button>`
                }
                else{
                    likeButton = `<button type="submit" class="like button is-danger">${"Like"}</button>`
                }
                if (response.data[i].isMine){
                    likeButton = ``;
                    deleteButton = `<button type="submit" class="del button is-pulled-right is-danger">${"Delete"}</button>`;
                    editButton = `<button type="submit" class="edit button is-pulled-right is-link">${"Edit"}</button>`
                }
                tweetsDiv.append($(`
                <div class="box" id=${"t" + response.data[i].id}>
                    <p class="content has-text-weight-bold">${response.data[i].author}</p>
                    <p>${response.data[i].body}</p>
                    <br>
                    <p class="has-text-weight-light">
                        ${"Likes: " + response.data[i].likeCount + " | "}
                        ${"Retweets: " + response.data[i].retweetCount}
                    </p>
                    <br>
                        ${likeButton}
                        <button type="submit" class="retweet button is-success">${"Retweet"}</button>
                        <button type="submit" class="reply button is-info">${"Reply"}</button>
                        ${deleteButton}
                        ${editButton}
                    <br>
                </div>
                `));
            }
            $(".like").on('click', function(event){
                let tweetDiv = $(event.target).parent();
                let id = tweetDiv.attr('id').substring(1);
                let tweet = tweets.find(t => (t.id) == id);
                if (tweet.isLiked){
                    handleUnlikeButtonPress(event);
                }
                else{
                    handleLikeButtonPress(event);
                }
            });
            $(".edit").on('click', function(event){
                handleEditButtonPress(event);
            })
            $(".del").on('click', function(event){
                handleDeleteButtonPress(event);
            })
            $(".reply").on('click', function(event){
                handleReplyButtonPress(event);
            })
            $(".retweet").on('click', function(event){
                handleRetweetButtonPress(event);
            })
        })
    .catch(error =>
        console.log(error)
    )
}