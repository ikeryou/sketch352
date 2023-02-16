import { Func } from '../core/func';
import { Canvas } from '../webgl/canvas';
import { Object3D } from 'three/src/core/Object3D';
import { Update } from '../libs/update';
import { SphereGeometry } from 'three/src/geometries/SphereGeometry';
import { Item } from './item';
import { Util } from '../libs/util';
import { MousePointer } from '../core/mousePointer';
import { Color } from 'three/src/math/Color';

export class Visual extends Canvas {

  private _con:Object3D;


  constructor(opt: any) {
    super(opt);

    this._con = new Object3D();
    this.mainScene.add(this._con);

    // const colAOrg = new Color(Util.instance.random(0,1), Util.instance.random(0,1), Util.instance.random(0,1));
    // const colBOrg = new Color(Util.instance.random(0,1), Util.instance.random(0,1), Util.instance.random(0,1));
    const colAOrg = new Color(1,0,0);
    const colBOrg = new Color(1,1,0);

    const num = 200;

    for(let i = 0; i < num; i++) {
      // const seg = Util.instance.map(i, 2, 32, 0, num - 1);
      const seg = 8;
      const geo = new SphereGeometry(0.5, seg, seg);

      const colA = colAOrg.clone();
      const colB = colBOrg.clone();
      colA.lerp(colB, Util.instance.map(i, 0, 1, 0, num - 1))
      const item = new Item({
        geo: geo,
        id: i,
        total: num,
        color: colA,
      });
      this._con.add(item);
    }

    this._resize();
  }


  protected _update(): void {
    super._update();

    this._con.position.y = Func.instance.screenOffsetY() * -1;

    const mx = MousePointer.instance.easeNormal.x;
    const my = MousePointer.instance.easeNormal.y;

    this._con.rotation.x = Util.instance.radian(90 + my * 180);
    this._con.rotation.z = Util.instance.radian(mx * -30);

    if (this.isNowRenderFrame()) {
      this._render()
    }
  }


  private _render(): void {
    this.renderer.setClearColor(0x000000, 1);
    this.renderer.render(this.mainScene, this.cameraPers);
  }


  public isNowRenderFrame(): boolean {
    return this.isRender && Update.instance.cnt % 1 == 0
  }


  _resize(): void {
    super._resize();

    const w = Func.instance.sw();
    const h = Func.instance.sh();

    this.renderSize.width = w;
    this.renderSize.height = h;

    this._updateOrthCamera(this.cameraOrth, w, h);

    this.cameraPers.fov = 45;
    this._updatePersCamera(this.cameraPers, w, h);

    let pixelRatio: number = window.devicePixelRatio || 1;
    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setSize(w, h);
    this.renderer.clear();
  }
}
