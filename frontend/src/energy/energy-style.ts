// Styles shared by the energy card and the "Ahora" part of its window.
import { css } from "lit";

export const energyStyles = css`
  .ehead {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: none;
    min-width: 0;
  }
  .ehead.sm {
    gap: 10px;
  }
  .eic {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: #ffb020;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: none;
  }
  .ehead.sm .eic {
    width: 34px;
    height: 34px;
  }
  .eic.sm {
    width: 40px;
    height: 40px;
  }
  .txt {
    display: flex;
    flex-direction: column;
    min-width: 0;
    flex: 1;
  }
  .name {
    font-size: 17px;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .ehead.sm .name {
    font-size: 15px;
  }
  .state {
    font-size: 13px;
    color: var(--fg2);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .tot {
    font-size: 28px;
    font-weight: 700;
    letter-spacing: -0.5px;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }
  .ehead.sm .tot {
    font-size: 24px;
  }
  .tot small {
    font-size: 14px;
    font-weight: 600;
    color: var(--fg2);
    letter-spacing: 0;
  }
  svg.flow {
    flex: 1;
    min-height: 0;
    width: 100%;
    overflow: visible;
  }
  .t1 {
    font: 600 14px Inter, system-ui, sans-serif;
    fill: #fff;
  }
  .t1.sm {
    font-size: 13.5px;
  }
  .t2 {
    font: 500 12.5px Inter, system-ui, sans-serif;
    fill: rgba(255, 255, 255, 0.72);
  }
  .t2.xs {
    font-size: 11px;
  }
  .big {
    font: 700 30px Inter, system-ui, sans-serif;
    fill: #fff;
    letter-spacing: -0.5px;
  }
  .mid {
    font: 700 21px Inter, system-ui, sans-serif;
    fill: #fff;
  }
  .stack,
  .hbar {
    display: flex;
    height: 10px;
    border-radius: 5px;
    overflow: hidden;
    gap: 2px;
    flex: none;
  }
  .hbar {
    position: absolute;
    left: 12px;
    right: 12px;
    bottom: 7px;
    height: 4px;
    gap: 1px;
  }
  .hbar i {
    background-image: repeating-linear-gradient(-45deg, rgba(255, 255, 255, 0.35) 0 4px, transparent 4px 8px);
    background-size: 11.3px 11.3px;
  }
  .hbar i:not(.mv) {
    background-image: none;
  }
  .legend {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    font-size: 12px;
    color: var(--fg2);
    flex: none;
    margin-top: -4px;
  }
  .legend b {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 5px;
  }
  .vstack {
    position: absolute;
    right: 14px;
    top: 14px;
    bottom: 14px;
    width: 12px;
    border-radius: 6px;
    overflow: hidden;
    display: flex;
    flex-direction: column-reverse;
    gap: 2px;
    background: rgba(255, 255, 255, 0.12);
  }
  /* bars */
  .lbars {
    display: flex;
    flex-direction: column;
    gap: 14px;
    flex: 1;
    justify-content: center;
    min-height: 0;
  }
  .lbars.sm {
    gap: 7px;
  }
  .lb {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
  }
  .lbars.sm .lb {
    gap: 9px;
  }
  .ci {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    flex: none;
  }
  .lbars.sm .ci {
    width: 26px;
    height: 26px;
  }
  .ci.xs {
    width: 20px;
    height: 20px;
  }
  .lbt {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .lbars.sm .lbt {
    gap: 3px;
  }
  .lbn {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    font-size: 14.5px;
    font-weight: 600;
    min-width: 0;
  }
  .lbn span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .lbn b {
    white-space: nowrap;
  }
  .lbn.top {
    flex: none;
    font-size: 15px;
  }
  .lbars.sm .lbn {
    font-size: 13px;
  }
  .lbn small {
    font-weight: 500;
    color: var(--fg2);
  }
  .trk {
    height: 12px;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.12);
    overflow: hidden;
    flex: 1;
    min-width: 0;
  }
  .lbars.sm .trk {
    height: 7px;
  }
  .trk i {
    display: block;
    height: 100%;
    border-radius: 6px;
    background: var(--c);
    transition: width 0.6s;
  }
  .trk i.mv,
  .hbar i.mv {
    background-image: repeating-linear-gradient(-45deg, rgba(255, 255, 255, 0.35) 0 7px, transparent 7px 14px);
    background-size: 19.8px 19.8px;
    animation: e-stripes linear infinite;
  }
  .hbar i.mv {
    background-image: repeating-linear-gradient(-45deg, rgba(255, 255, 255, 0.35) 0 4px, transparent 4px 8px);
    background-size: 11.3px 11.3px;
    animation-name: e-stripes-s;
  }
  @keyframes e-stripes {
    to {
      background-position: 19.8px 0;
    }
  }
  @keyframes e-stripes-s {
    to {
      background-position: 11.3px 0;
    }
  }
  .mini {
    display: flex;
    flex-direction: column;
    gap: 9px;
    flex: none;
  }
  .mr {
    display: flex;
    align-items: center;
    gap: 7px;
  }
  .mr .trk {
    height: 7px;
  }
  .mr b {
    font-size: 12px;
    min-width: 30px;
    text-align: right;
  }
  @media (prefers-reduced-motion: reduce) {
    .trk i.mv,
    .hbar i.mv {
      animation: none;
    }
  }
`;
