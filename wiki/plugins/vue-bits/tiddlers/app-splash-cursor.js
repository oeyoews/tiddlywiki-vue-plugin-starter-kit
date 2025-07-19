"use strict";const p=window.Vue,Ce={class:"fixed top-0 left-0 z-50 pointer-events-none w-full h-full"},Be=p.defineComponent({__name:"Splash",props:{SIM_RESOLUTION:{default:128},DYE_RESOLUTION:{default:1440},CAPTURE_RESOLUTION:{default:512},DENSITY_DISSIPATION:{default:3.5},VELOCITY_DISSIPATION:{default:2},PRESSURE:{default:.1},PRESSURE_ITERATIONS:{default:20},CURL:{default:3},SPLAT_RADIUS:{default:.2},SPLAT_FORCE:{default:6e3},SHADING:{type:Boolean,default:!0},COLOR_UPDATE_SPEED:{default:10},BACK_COLOR:{default:()=>({r:.5,g:0,b:0})},TRANSPARENT:{type:Boolean,default:!0}},setup(X){const l=X,w=p.useTemplateRef("canvasRef");function ie(){return{id:-1,texcoordX:0,texcoordY:0,prevTexcoordX:0,prevTexcoordY:0,deltaX:0,deltaY:0,down:!1,moved:!1,color:{r:0,g:0,b:0}}}return p.onMounted(()=>{const s=w.value;if(!s)return;const g=[ie()],v={SIM_RESOLUTION:l.SIM_RESOLUTION,DYE_RESOLUTION:l.DYE_RESOLUTION,CAPTURE_RESOLUTION:l.CAPTURE_RESOLUTION,DENSITY_DISSIPATION:l.DENSITY_DISSIPATION,VELOCITY_DISSIPATION:l.VELOCITY_DISSIPATION,PRESSURE:l.PRESSURE,PRESSURE_ITERATIONS:l.PRESSURE_ITERATIONS,CURL:l.CURL,SPLAT_RADIUS:l.SPLAT_RADIUS,SPLAT_FORCE:l.SPLAT_FORCE,SHADING:l.SHADING,COLOR_UPDATE_SPEED:l.COLOR_UPDATE_SPEED,BACK_COLOR:l.BACK_COLOR,TRANSPARENT:l.TRANSPARENT},{gl:t,ext:_}=oe(s);if(!t||!_)return;_.supportLinearFiltering||(v.DYE_RESOLUTION=256,v.SHADING=!1);function oe(e){const i={alpha:!0,depth:!1,stencil:!1,antialias:!1,preserveDrawingBuffer:!1};let r=e.getContext("webgl2",i);if(r||(r=e.getContext("webgl",i)||e.getContext("experimental-webgl",i)),!r)throw new Error("Unable to initialize WebGL.");const o="drawBuffers"in r;let n=!1,a=null;o?(r.getExtension("EXT_color_buffer_float"),n=!!r.getExtension("OES_texture_float_linear")):(a=r.getExtension("OES_texture_half_float"),n=!!r.getExtension("OES_texture_half_float_linear")),r.clearColor(0,0,0,1);const c=o?r.HALF_FLOAT:a&&a.HALF_FLOAT_OES||0;let h,T,y;return o?(h=U(r,r.RGBA16F,r.RGBA,c),T=U(r,r.RG16F,r.RG,c),y=U(r,r.R16F,r.RED,c)):(h=U(r,r.RGBA,r.RGBA,c),T=U(r,r.RGBA,r.RGBA,c),y=U(r,r.RGBA,r.RGBA,c)),{gl:r,ext:{formatRGBA:h,formatRG:T,formatR:y,halfFloatTexType:c,supportLinearFiltering:n}}}function U(e,i,r,o){if(!ne(e,i,r,o)){if("drawBuffers"in e){const n=e;switch(i){case n.R16F:return U(n,n.RG16F,n.RG,o);case n.RG16F:return U(n,n.RGBA16F,n.RGBA,o);default:return null}}return null}return{internalFormat:i,format:r}}function ne(e,i,r,o){const n=e.createTexture();if(!n)return!1;e.bindTexture(e.TEXTURE_2D,n),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,i,4,4,0,r,o,null);const a=e.createFramebuffer();return a?(e.bindFramebuffer(e.FRAMEBUFFER,a),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,n,0),e.checkFramebufferStatus(e.FRAMEBUFFER)===e.FRAMEBUFFER_COMPLETE):!1}function ae(e){if(!e.length)return 0;let i=0;for(let r=0;r<e.length;r++)i=(i<<5)-i+e.charCodeAt(r),i|=0;return i}function ue(e,i){if(!i)return e;let r="";for(const o of i)r+=`#define ${o}
`;return r+e}function S(e,i,r=null){const o=ue(i,r),n=t.createShader(e);return n?(t.shaderSource(n,o),t.compileShader(n),t.getShaderParameter(n,t.COMPILE_STATUS)||console.trace(t.getShaderInfoLog(n)),n):null}function q(e,i){if(!e||!i)return null;const r=t.createProgram();return r?(t.attachShader(r,e),t.attachShader(r,i),t.linkProgram(r),t.getProgramParameter(r,t.LINK_STATUS)||console.trace(t.getProgramInfoLog(r)),r):null}function $(e){const i={},r=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let o=0;o<r;o++){const n=t.getActiveUniform(e,o);n&&(i[n.name]=t.getUniformLocation(e,n.name))}return i}class A{constructor(i,r){this.program=q(i,r),this.uniforms=this.program?$(this.program):{}}bind(){this.program&&t.useProgram(this.program)}}class ce{constructor(i,r){this.vertexShader=i,this.fragmentShaderSource=r,this.programs={},this.activeProgram=null,this.uniforms={}}setKeywords(i){let r=0;for(const n of i)r+=ae(n);let o=this.programs[r];if(o==null){const n=S(t.FRAGMENT_SHADER,this.fragmentShaderSource,i);o=q(this.vertexShader,n),this.programs[r]=o}o!==this.activeProgram&&(o&&(this.uniforms=$(o)),this.activeProgram=o)}bind(){this.activeProgram&&t.useProgram(this.activeProgram)}}const D=S(t.VERTEX_SHADER,`
      precision highp float;
      attribute vec2 aPosition;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform vec2 texelSize;
      void main () {
        vUv = aPosition * 0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `),se=S(t.FRAGMENT_SHADER,`
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      uniform sampler2D uTexture;
      void main () {
        gl_FragColor = texture2D(uTexture, vUv);
      }
    `),fe=S(t.FRAGMENT_SHADER,`
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      uniform sampler2D uTexture;
      uniform float value;
      void main () {
        gl_FragColor = value * texture2D(uTexture, vUv);
      }
    `),le=`
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uTexture;
      uniform sampler2D uDithering;
      uniform vec2 ditherScale;
      uniform vec2 texelSize;
      vec3 linearToGamma (vec3 color) {
          color = max(color, vec3(0));
          return max(1.055 * pow(color, vec3(0.416666667)) - 0.055, vec3(0));
      }
      void main () {
          vec3 c = texture2D(uTexture, vUv).rgb;
          #ifdef SHADING
              vec3 lc = texture2D(uTexture, vL).rgb;
              vec3 rc = texture2D(uTexture, vR).rgb;
              vec3 tc = texture2D(uTexture, vT).rgb;
              vec3 bc = texture2D(uTexture, vB).rgb;
              float dx = length(rc) - length(lc);
              float dy = length(tc) - length(bc);
              vec3 n = normalize(vec3(dx, dy, length(texelSize)));
              vec3 l = vec3(0.0, 0.0, 1.0);
              float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
              c *= diffuse;
          #endif
          float a = max(c.r, max(c.g, c.b));
          gl_FragColor = vec4(c, a);
      }
    `,ve=S(t.FRAGMENT_SHADER,`
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uTarget;
      uniform float aspectRatio;
      uniform vec3 color;
      uniform vec2 point;
      uniform float radius;
      void main () {
          vec2 p = vUv - point.xy;
          p.x *= aspectRatio;
          vec3 splat = exp(-dot(p, p) / radius) * color;
          vec3 base = texture2D(uTarget, vUv).xyz;
          gl_FragColor = vec4(base + splat, 1.0);
      }
    `),me=S(t.FRAGMENT_SHADER,`
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 texelSize;
      uniform vec2 dyeTexelSize;
      uniform float dt;
      uniform float dissipation;
      vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
          vec2 st = uv / tsize - 0.5;
          vec2 iuv = floor(st);
          vec2 fuv = fract(st);
          vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
          vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
          vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
          vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
          return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
      }
      void main () {
          #ifdef MANUAL_FILTERING
              vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
              vec4 result = bilerp(uSource, coord, dyeTexelSize);
          #else
              vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
              vec4 result = texture2D(uSource, coord);
          #endif
          float decay = 1.0 + dissipation * dt;
          gl_FragColor = result / decay;
      }
    `,_.supportLinearFiltering?null:["MANUAL_FILTERING"]),de=S(t.FRAGMENT_SHADER,`
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;
      void main () {
          float L = texture2D(uVelocity, vL).x;
          float R = texture2D(uVelocity, vR).x;
          float T = texture2D(uVelocity, vT).y;
          float B = texture2D(uVelocity, vB).y;
          vec2 C = texture2D(uVelocity, vUv).xy;
          if (vL.x < 0.0) { L = -C.x; }
          if (vR.x > 1.0) { R = -C.x; }
          if (vT.y > 1.0) { T = -C.y; }
          if (vB.y < 0.0) { B = -C.y; }
          float div = 0.5 * (R - L + T - B);
          gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
      }
    `),he=S(t.FRAGMENT_SHADER,`
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;
      void main () {
          float L = texture2D(uVelocity, vL).y;
          float R = texture2D(uVelocity, vR).y;
          float T = texture2D(uVelocity, vT).x;
          float B = texture2D(uVelocity, vB).x;
          float vorticity = R - L - T + B;
          gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
      }
    `),Te=S(t.FRAGMENT_SHADER,`
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;
      uniform sampler2D uCurl;
      uniform float curl;
      uniform float dt;
      void main () {
          float L = texture2D(uCurl, vL).x;
          float R = texture2D(uCurl, vR).x;
          float T = texture2D(uCurl, vT).x;
          float B = texture2D(uCurl, vB).x;
          float C = texture2D(uCurl, vUv).x;
          vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
          force /= length(force) + 0.0001;
          force *= curl * C;
          force.y *= -1.0;
          vec2 velocity = texture2D(uVelocity, vUv).xy;
          velocity += force * dt;
          velocity = min(max(velocity, -1000.0), 1000.0);
          gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
    `),Re=S(t.FRAGMENT_SHADER,`
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uDivergence;
      void main () {
          float L = texture2D(uPressure, vL).x;
          float R = texture2D(uPressure, vR).x;
          float T = texture2D(uPressure, vT).x;
          float B = texture2D(uPressure, vB).x;
          float C = texture2D(uPressure, vUv).x;
          float divergence = texture2D(uDivergence, vUv).x;
          float pressure = (L + R + B + T - divergence) * 0.25;
          gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
      }
    `),Ee=S(t.FRAGMENT_SHADER,`
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uVelocity;
      void main () {
          float L = texture2D(uPressure, vL).x;
          float R = texture2D(uPressure, vR).x;
          float T = texture2D(uPressure, vT).x;
          float B = texture2D(uPressure, vB).x;
          vec2 velocity = texture2D(uVelocity, vUv).xy;
          velocity.xy -= vec2(R - L, T - B);
          gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
    `),E=(()=>{const e=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,e),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,-1,1,1,1,1,-1]),t.STATIC_DRAW);const i=t.createBuffer();return t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,i),t.bufferData(t.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,0,2,3]),t.STATIC_DRAW),t.vertexAttribPointer(0,2,t.FLOAT,!1,0,0),t.enableVertexAttribArray(0),(r,o=!1)=>{t&&(r?(t.viewport(0,0,r.width,r.height),t.bindFramebuffer(t.FRAMEBUFFER,r.fbo)):(t.viewport(0,0,t.drawingBufferWidth,t.drawingBufferHeight),t.bindFramebuffer(t.FRAMEBUFFER,null)),o&&(t.clearColor(0,0,0,1),t.clear(t.COLOR_BUFFER_BIT)),t.drawElements(t.TRIANGLES,6,t.UNSIGNED_SHORT,0))}})();let R,u,M,G,L;const V=new A(D,se),N=new A(D,fe),m=new A(D,ve),f=new A(D,me),C=new A(D,de),B=new A(D,he),x=new A(D,Te),P=new A(D,Re),F=new A(D,Ee),I=new ce(D,le);function O(e,i,r,o,n,a){t.activeTexture(t.TEXTURE0);const c=t.createTexture();t.bindTexture(t.TEXTURE_2D,c),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,a),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,a),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texImage2D(t.TEXTURE_2D,0,r,e,i,0,o,n,null);const h=t.createFramebuffer();t.bindFramebuffer(t.FRAMEBUFFER,h),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,c,0),t.viewport(0,0,e,i),t.clear(t.COLOR_BUFFER_BIT);const T=1/e,y=1/i;return{texture:c,fbo:h,width:e,height:i,texelSizeX:T,texelSizeY:y,attach(b){return t.activeTexture(t.TEXTURE0+b),t.bindTexture(t.TEXTURE_2D,c),b}}}function H(e,i,r,o,n,a){const c=O(e,i,r,o,n,a),h=O(e,i,r,o,n,a);return{width:e,height:i,texelSizeX:c.texelSizeX,texelSizeY:c.texelSizeY,read:c,write:h,swap(){const T=this.read;this.read=this.write,this.write=T}}}function Se(e,i,r,o,n,a,c){const h=O(i,r,o,n,a,c);return V.bind(),V.uniforms.uTexture&&t.uniform1i(V.uniforms.uTexture,e.attach(0)),E(h,!1),h}function j(e,i,r,o,n,a,c){return e.width===i&&e.height===r||(e.read=Se(e.read,i,r,o,n,a,c),e.write=O(i,r,o,n,a,c),e.width=i,e.height=r,e.texelSizeX=1/i,e.texelSizeY=1/r),e}function J(){const e=Q(v.SIM_RESOLUTION),i=Q(v.DYE_RESOLUTION),r=_.halfFloatTexType,o=_.formatRGBA,n=_.formatRG,a=_.formatR,c=_.supportLinearFiltering?t.LINEAR:t.NEAREST;t.disable(t.BLEND),o&&(R?R=j(R,i.width,i.height,o.internalFormat,o.format,r,c):R=H(i.width,i.height,o.internalFormat,o.format,r,c),n&&(u?u=j(u,e.width,e.height,n.internalFormat,n.format,r,c):u=H(e.width,e.height,n.internalFormat,n.format,r,c),a&&(M=O(e.width,e.height,a.internalFormat,a.format,r,t.NEAREST),G=O(e.width,e.height,a.internalFormat,a.format,r,t.NEAREST),L=H(e.width,e.height,a.internalFormat,a.format,r,t.NEAREST))))}function xe(){const e=[];v.SHADING&&e.push("SHADING"),I.setKeywords(e)}function Q(e){const i=t.drawingBufferWidth,r=t.drawingBufferHeight,o=i/r,n=o<1?1/o:o,a=Math.round(e),c=Math.round(e*n);return i>r?{width:c,height:a}:{width:a,height:c}}function d(e){const i=window.devicePixelRatio||1;return Math.floor(e*i)}xe(),J();let Z=Date.now(),z=0;function k(){const e=pe();ge()&&J(),_e(e),De(),Ae(e),ye(null),requestAnimationFrame(k)}function pe(){const e=Date.now();let i=(e-Z)/1e3;return i=Math.min(i,.016666),Z=e,i}function ge(){const e=d(s.clientWidth),i=d(s.clientHeight);return s.width!==e||s.height!==i?(s.width=e,s.height=i,!0):!1}function _e(e){z+=e*v.COLOR_UPDATE_SPEED,z>=1&&(z=Ne(z,0,1),g.forEach(i=>{i.color=Y()}))}function De(){for(const e of g)e.moved&&(e.moved=!1,Le(e))}function Ae(e){t.disable(t.BLEND),B.bind(),B.uniforms.texelSize&&t.uniform2f(B.uniforms.texelSize,u.texelSizeX,u.texelSizeY),B.uniforms.uVelocity&&t.uniform1i(B.uniforms.uVelocity,u.read.attach(0)),E(G),x.bind(),x.uniforms.texelSize&&t.uniform2f(x.uniforms.texelSize,u.texelSizeX,u.texelSizeY),x.uniforms.uVelocity&&t.uniform1i(x.uniforms.uVelocity,u.read.attach(0)),x.uniforms.uCurl&&t.uniform1i(x.uniforms.uCurl,G.attach(1)),x.uniforms.curl&&t.uniform1f(x.uniforms.curl,v.CURL),x.uniforms.dt&&t.uniform1f(x.uniforms.dt,e),E(u.write),u.swap(),C.bind(),C.uniforms.texelSize&&t.uniform2f(C.uniforms.texelSize,u.texelSizeX,u.texelSizeY),C.uniforms.uVelocity&&t.uniform1i(C.uniforms.uVelocity,u.read.attach(0)),E(M),N.bind(),N.uniforms.uTexture&&t.uniform1i(N.uniforms.uTexture,L.read.attach(0)),N.uniforms.value&&t.uniform1f(N.uniforms.value,v.PRESSURE),E(L.write),L.swap(),P.bind(),P.uniforms.texelSize&&t.uniform2f(P.uniforms.texelSize,u.texelSizeX,u.texelSizeY),P.uniforms.uDivergence&&t.uniform1i(P.uniforms.uDivergence,M.attach(0));for(let r=0;r<v.PRESSURE_ITERATIONS;r++)P.uniforms.uPressure&&t.uniform1i(P.uniforms.uPressure,L.read.attach(1)),E(L.write),L.swap();F.bind(),F.uniforms.texelSize&&t.uniform2f(F.uniforms.texelSize,u.texelSizeX,u.texelSizeY),F.uniforms.uPressure&&t.uniform1i(F.uniforms.uPressure,L.read.attach(0)),F.uniforms.uVelocity&&t.uniform1i(F.uniforms.uVelocity,u.read.attach(1)),E(u.write),u.swap(),f.bind(),f.uniforms.texelSize&&t.uniform2f(f.uniforms.texelSize,u.texelSizeX,u.texelSizeY),!_.supportLinearFiltering&&f.uniforms.dyeTexelSize&&t.uniform2f(f.uniforms.dyeTexelSize,u.texelSizeX,u.texelSizeY);const i=u.read.attach(0);f.uniforms.uVelocity&&t.uniform1i(f.uniforms.uVelocity,i),f.uniforms.uSource&&t.uniform1i(f.uniforms.uSource,i),f.uniforms.dt&&t.uniform1f(f.uniforms.dt,e),f.uniforms.dissipation&&t.uniform1f(f.uniforms.dissipation,v.VELOCITY_DISSIPATION),E(u.write),u.swap(),!_.supportLinearFiltering&&f.uniforms.dyeTexelSize&&t.uniform2f(f.uniforms.dyeTexelSize,R.texelSizeX,R.texelSizeY),f.uniforms.uVelocity&&t.uniform1i(f.uniforms.uVelocity,u.read.attach(0)),f.uniforms.uSource&&t.uniform1i(f.uniforms.uSource,R.read.attach(1)),f.uniforms.dissipation&&t.uniform1f(f.uniforms.dissipation,v.DENSITY_DISSIPATION),E(R.write),R.swap()}function ye(e){t.blendFunc(t.ONE,t.ONE_MINUS_SRC_ALPHA),t.enable(t.BLEND),Ue(e)}function Ue(e){const i=t.drawingBufferWidth,r=t.drawingBufferHeight;I.bind(),v.SHADING&&I.uniforms.texelSize&&t.uniform2f(I.uniforms.texelSize,1/i,1/r),I.uniforms.uTexture&&t.uniform1i(I.uniforms.uTexture,R.read.attach(0)),E(e,!1)}function Le(e){const i=e.deltaX*v.SPLAT_FORCE,r=e.deltaY*v.SPLAT_FORCE;ee(e.texcoordX,e.texcoordY,i,r,e.color)}function Pe(e){const i=Y();i.r*=10,i.g*=10,i.b*=10;const r=10*(Math.random()-.5),o=30*(Math.random()-.5);ee(e.texcoordX,e.texcoordY,r,o,i)}function ee(e,i,r,o,n){m.bind(),m.uniforms.uTarget&&t.uniform1i(m.uniforms.uTarget,u.read.attach(0)),m.uniforms.aspectRatio&&t.uniform1f(m.uniforms.aspectRatio,s.width/s.height),m.uniforms.point&&t.uniform2f(m.uniforms.point,e,i),m.uniforms.color&&t.uniform3f(m.uniforms.color,r,o,0),m.uniforms.radius&&t.uniform1f(m.uniforms.radius,Fe(v.SPLAT_RADIUS/100)),E(u.write),u.swap(),m.uniforms.uTarget&&t.uniform1i(m.uniforms.uTarget,R.read.attach(0)),m.uniforms.color&&t.uniform3f(m.uniforms.color,n.r,n.g,n.b),E(R.write),R.swap()}function Fe(e){const i=s.width/s.height;return i>1&&(e*=i),e}function W(e,i,r,o){e.id=i,e.down=!0,e.moved=!1,e.texcoordX=r/s.width,e.texcoordY=1-o/s.height,e.prevTexcoordX=e.texcoordX,e.prevTexcoordY=e.texcoordY,e.deltaX=0,e.deltaY=0,e.color=Y()}function K(e,i,r,o){e.prevTexcoordX=e.texcoordX,e.prevTexcoordY=e.texcoordY,e.texcoordX=i/s.width,e.texcoordY=1-r/s.height,e.deltaX=Oe(e.texcoordX-e.prevTexcoordX),e.deltaY=be(e.texcoordY-e.prevTexcoordY),e.moved=Math.abs(e.deltaX)>0||Math.abs(e.deltaY)>0,e.color=o}function Ie(e){e.down=!1}function Oe(e){const i=s.width/s.height;return i<1&&(e*=i),e}function be(e){const i=s.width/s.height;return i>1&&(e/=i),e}function Y(){const e=we(Math.random(),1,1);return e.r*=.15,e.g*=.15,e.b*=.15,e}function we(e,i,r){let o=0,n=0,a=0;const c=Math.floor(e*6),h=e*6-c,T=r*(1-i),y=r*(1-h*i),b=r*(1-(1-h)*i);switch(c%6){case 0:o=r,n=b,a=T;break;case 1:o=y,n=r,a=T;break;case 2:o=T,n=r,a=b;break;case 3:o=T,n=y,a=r;break;case 4:o=b,n=T,a=r;break;case 5:o=r,n=T,a=y;break}return{r:o,g:n,b:a}}function Ne(e,i,r){const o=r-i;return(e-i)%o+i}window.addEventListener("mousedown",e=>{const i=g[0],r=d(e.clientX),o=d(e.clientY);W(i,-1,r,o),Pe(i)});function te(e){const i=g[0],r=d(e.clientX),o=d(e.clientY),n=Y();k(),K(i,r,o,n),document.body.removeEventListener("mousemove",te)}document.body.addEventListener("mousemove",te),window.addEventListener("mousemove",e=>{const i=g[0],r=d(e.clientX),o=d(e.clientY),n=i.color;K(i,r,o,n)});function re(e){const i=e.targetTouches,r=g[0];for(let o=0;o<i.length;o++){const n=d(i[o].clientX),a=d(i[o].clientY);k(),W(r,i[o].identifier,n,a)}document.body.removeEventListener("touchstart",re)}document.body.addEventListener("touchstart",re),window.addEventListener("touchstart",e=>{const i=e.targetTouches,r=g[0];for(let o=0;o<i.length;o++){const n=d(i[o].clientX),a=d(i[o].clientY);W(r,i[o].identifier,n,a)}},!1),window.addEventListener("touchmove",e=>{const i=e.targetTouches,r=g[0];for(let o=0;o<i.length;o++){const n=d(i[o].clientX),a=d(i[o].clientY);K(r,n,a,r.color)}},!1),window.addEventListener("touchend",e=>{const i=e.changedTouches,r=g[0];for(let o=0;o<i.length;o++)Ie(r)})}),(s,g)=>(p.openBlock(),p.createElementBlock("div",Ce,[p.createElementVNode("canvas",{ref_key:"canvasRef",ref:w,id:"fluid",class:"w-screen h-screen block"},null,512)]))}}),Xe={class:"vue-bits-plugin"},ze=p.defineComponent({__name:"AppSplashCursor",props:{title:{},theme:{},showLogos:{type:Boolean}},setup(X){return(l,w)=>(p.openBlock(),p.createElementBlock("div",Xe,[p.createVNode(Be,{SIM_RESOLUTION:128,DYE_RESOLUTION:1440,CAPTURE_RESOLUTION:512,DENSITY_DISSIPATION:3.5,VELOCITY_DISSIPATION:2,PRESSURE:.1,PRESSURE_ITERATIONS:20,CURL:3,SPLAT_RADIUS:.2,SPLAT_FORCE:6e3,SHADING:!0,COLOR_UPDATE_SPEED:10,BACK_COLOR:{r:.5,g:0,b:0},TRANSPARENT:!0})]))}});function Ye(X={}){return function(l={}){const w={...X,...l};return{render(){return p.h(ze,w)}}}}module.exports=Ye;
