import vt from '../glsl/item.vert';
import fg from '../glsl/item.frag';
import { Mesh } from 'three/src/objects/Mesh';
import { Color } from 'three/src/math/Color';
import { FrontSide } from 'three/src/constants';
import { SphereGeometry } from 'three/src/geometries/SphereGeometry';
import { MyObject3D } from "../webgl/myObject3D";
import { Func } from '../core/func';
import { ShaderMaterial } from 'three/src/materials/ShaderMaterial';
import { Util } from '../libs/util';
import { MousePointer } from '../core/mousePointer';

export class Item extends MyObject3D {

  private _id: number;
  private _mesh: Mesh;

  constructor(opt: {geo: SphereGeometry, id: number, total: number, color: Color}) {
    super();

    this._id = opt.id;

    const radius = (1 / opt.total) * 0.5;
    const range = 0.85
    const center = Util.instance.map(opt.id, -range, range, 0, opt.total - 1);

    this._mesh = new Mesh(
      opt.geo,
      new ShaderMaterial({
        vertexShader:vt,
        fragmentShader:fg,
        transparent:true,
        depthTest:false,
        side: FrontSide,
        uniforms:{
          color:{value: opt.color},
          alpha:{value: 1},
          radius:{value: radius * 1},
          center:{value: center},
        }
      })
    );
    this.add(this._mesh);
  }

  protected _update():void {
    super._update();

    const sw = Func.instance.sw();
    const sh = Func.instance.sh();

    const speed = 0.75;

    const mx = MousePointer.instance.easeNormal.x;
    // const my = MousePointer.instance.easeNormal.y;

    const itA = 0.055;
    const itB = 0.02;

    const s = Math.max(sw, sh) * 0.6;
    const offsetScale = Util.instance.map(Math.sin(this._c * 0.08 * speed + this._id * itA), 0.5, 1, -1, 1)
    this._mesh.scale.set(s * offsetScale, s * offsetScale, s * offsetScale);

    this._mesh.rotation.y = Util.instance.radian(Math.sin(this._c * 0.01 * speed + this._id * itB) * (mx * 180 * 1.5))
  }
}