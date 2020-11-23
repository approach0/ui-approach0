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
  var remove_class = "imathjax";
  var replace_class = "imathjax-rendered";

  var err_tag_open_0  = '<span class="imath-err" title="';
  var err_tag_open_1  = '">';
  var err_tag_close = '</span>';

  $(scope_select).each(function() {
    var origin = $(this).html();
    var repl = origin.replace(
      replace_regex,
      function (_, tex) {
        return tex_tag_open + tex + tex_tag_close;
    });
    $(this).html(repl);
  });

  var workload = $(scope_select + ' ' + `.${remove_class},.${replace_class}`).length || 1;
  var progress = $(scope_select + ' ' + `.${replace_class}`).length || 0;

  progress_callbk && progress_callbk(progress, workload);

  MathJax.texReset();

  $(scope_select + ' ' + `.${remove_class}`).each(function(index) {
    var vm = $(this);
    var tex = vm.text();
    var ele = vm.get(0);
    setTimeout(function() {
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

      } catch(err) {
        if (err.toString().indexOf('retry') != -1) {
          console.error('[MathJax tex-render retry]', tex);
          return;
        }
        vm.html(
          err_tag_open_0 + err + err_tag_open_1 +
          tex + err_tag_close
        );
      }
    }, Math.floor(index / 64) * 500)
  });
}

exports.render      = mathjax_tex_render;
exports.render_fast = katex_tex_render;
