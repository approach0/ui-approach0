function katex_tex_render(scope_select) {
  var tex_tag_open  = '<span class="imath-to-render">';
  var tex_tag_close = '</span>';

  var replace_regex = /\[imath\]([\s\S]+?)\[\/imath\]/g;
  var render_select = "span.imath-to-render";
  var remove_class = "imath-to-render";
  var replace_class = "imath-rendered";

  var err_tag_open_0  = '<span class="imath-err" title="';
  var err_tag_open_1  = '">';
  var err_tag_close = '</span>';

  $(scope_select).each(function() {
    var repl = $(this).html().replace(
      replace_regex,
      function (a, b) {
        return tex_tag_open + b + tex_tag_close;
      });
    $(this).html(repl);
  });

  $(render_select).each(function() {
    var tex = $(this).text();
    var ele = $(this).get(0);
    try {
      katex.render(tex, ele, {
        displayMode: true,
        macros: {
          "\\qvar": "\\color{blue}"
        }
      });
    } catch(err) {
      $(this).html(
        err_tag_open_0 + err + err_tag_open_1 +
        tex + err_tag_close
      );
    }

    /* prevent from being rendered again */
    $(this).removeClass(remove_class).addClass(replace_class);
  });
}

function mathjax_tex_render(scope_select, progress_callbk) {
  var replace_regex = /\[imath\]([\s\S]+?)\[\/imath\]/g;
  var tex_tag_open  = '<span class="imathjax">';
  var tex_tag_close = '</span>';
  var render_select = "span.imathjax";
  var remove_class =  "imathjax";
  var replace_class = "imathjax-rendered";

  var err_tag_open_0  = '<span class="imath-err" title="';
  var err_tag_open_1  = '">';
  var err_tag_close = '</span>';

  var workload = 0;
  var progress = 0;

  $(scope_select).each(function() {
    var origin = $(this).html();
    var repl = origin.replace(
      replace_regex,
      function (_, tex) {
        workload += 1;
        return tex_tag_open + tex + tex_tag_close;
    });
    $(this).html(repl);
  });

  progress_callbk && progress_callbk(progress, workload);

  MathJax.texReset();

  var intv = setInterval(function () {
    var leftover = 0;
    $(scope_select + ' ' + render_select).each(function(index) {
      if (index > 64)
        return false;
      var vm = $(this);
      var tex = vm.text();
      var ele = vm.get(0);
      try {
        var math_ele = MathJax.tex2svg(tex, {
          display: false
        });

        // var svg = MathJax.startup.adaptor.innerHTML(math_ele);
        var adaptor = MathJax.startup.adaptor;
        var svg = adaptor.outerHTML(adaptor.tags(math_ele, 'svg')[0]);

        /* scale up math expressions a little */
        //var scale = 1.1;
        //var jq_svg = $(svg);
        //var w = jq_svg.attr('width');
        //var h = jq_svg.attr('height');
        //w = '' + (scale * parseFloat(w.split('ex')[0])) + 'ex';
        //h = '' + (scale * parseFloat(h.split('ex')[0])) + 'ex';
        //jq_svg.attr('width', w);
        //jq_svg.attr('height', h);
        //svg = jq_svg[0];

        /* prevent from being rendered again */
        vm.removeClass(remove_class).addClass(replace_class);

        $(ele).html(svg);
        $(ele).append('<script type="math/tex">' + tex + '</script>');

        MathJax.startup.document.clear();
        MathJax.startup.document.updateDocument();

        progress += 1;
        progress_callbk && progress_callbk(progress, workload);

        leftover = 1;

      } catch(err) {
        if (err.toString().indexOf('retry') != -1) {
          // console.log('retry', tex);
          return;
        }
        vm.html(
          err_tag_open_0 + err + err_tag_open_1 +
          tex + err_tag_close
        );
      }
    });
    if (leftover == 0) {
      clearInterval(intv);
    }
  }, 500);
}

exports.render      = mathjax_tex_render;
exports.render_fast = katex_tex_render;
