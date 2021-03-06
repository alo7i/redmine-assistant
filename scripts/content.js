var ISSUE_RE = /redmine.*\/issues\/(\d+)/
var ISSUE_BUG_ID = /(\w+)\s+#(\d+)/;
var GIT_ACTION_MAP = {
  'Bug': 'fix',
  'Task': 'feat'
};

function copyToClipboard(text) {
  const input = document.createElement('input');
  input.style.position = 'fixed';
  input.style.opacity = 0;
  input.value = text;
  document.body.appendChild(input);
  input.select();
  document.execCommand('Copy');
  document.body.removeChild(input);
};

$(document).ready(function () {
  var issue_matches = ISSUE_RE.exec(location.href);
  if (!issue_matches) return;
  var issue_title = $('#content h2').text();
  var [issue_bug, id] = issue_title.split(' #')
  var message = $('#content h3').eq(0).text();
  var git_action = `${GIT_ACTION_MAP[issue_bug] || 'feat'}`
  var git_msg = `${message} - (REDMINE-${id})`;

  $('#content h2').after(`
    <header id="git_msg" class="issue tracker-58 1-2 priority-4 priority-default details left">
      <div class="left">
        <span class="git_action" data-git-action="${git_action}">${git_action}</span>
        :
        <span class="git_msg">${git_msg}</span>
      </div>
      <div class="right">
        <span class="icon icon-copy">[ 点击/右键 ]</span> 可以复制内容到简体板
      </div>
    </header>
  `);

  $('#content #git_msg').contextmenu(function (e) {
    var text = git_msg;
    e.preventDefault();
    copyToClipboard(text);
    $.toast({
      icon: 'info',
      heading: '复制成功',
      position: 'top-right',
      stack: false,
      hideAfter: 1000,
      text
    });
  });

  $('#content #git_msg').click(function () {
    var text = `${git_action}: ${git_msg}`;
    var versionText = $('.fixed-version').text();
    if (versionText.includes('.')){
      var version = versionText.split(':')[1].toLowerCase();
      text = `${git_action}(${version}): ${git_msg}`;
    }

    copyToClipboard(text);
    $.toast({
      icon: 'success',
      heading: '复制成功',
      position: 'top-right',
      stack: false,
      hideAfter: 1000,
      text
    });
  });

});
