/* @ds-bundle: {"format":4,"namespace":"TornerANanoDesignSystem_e2735b","components":[{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Table","sourcePath":"components/data/Table.jsx"},{"name":"Badge","sourcePath":"components/feedback/Badge.jsx"},{"name":"StatusBadge","sourcePath":"components/feedback/StatusBadge.jsx"},{"name":"Tag","sourcePath":"components/feedback/Tag.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"},{"name":"Dialog","sourcePath":"components/overlay/Dialog.jsx"},{"name":"Card","sourcePath":"components/surfaces/Card.jsx"}],"sourceHashes":{"components/core/Button.jsx":"8d6d62c53053","components/core/IconButton.jsx":"b8f3b3560597","components/data/Table.jsx":"02b9151c625c","components/feedback/Badge.jsx":"0d995c76d2cc","components/feedback/StatusBadge.jsx":"82f85b917f95","components/feedback/Tag.jsx":"30bd085ba2eb","components/feedback/Toast.jsx":"fbac3588e326","components/feedback/Tooltip.jsx":"ee8271759bed","components/forms/Checkbox.jsx":"c9a52874c717","components/forms/Input.jsx":"a32c8737e117","components/forms/Radio.jsx":"9157b4b3fef4","components/forms/Select.jsx":"cf519c9927fd","components/forms/Switch.jsx":"b1d2e9d91b3e","components/navigation/Tabs.jsx":"c1c59ef3a329","components/overlay/Dialog.jsx":"650d02f8c198","components/surfaces/Card.jsx":"365658e8d09e","ui_kits/app/InvoicesScreen.jsx":"ca5c592c35d6","ui_kits/app/QuotesScreen.jsx":"1dc12fc4d003","ui_kits/app/Sidebar.jsx":"73cc3dbf8cb0","ui_kits/app/StockScreen.jsx":"033a074bdc22"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.TornerANanoDesignSystem_e2735b = window.TornerANanoDesignSystem_e2735b || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Button.jsx
try { (() => {
let injected = false;
function injectStyles() {
  if (injected) return;
  injected = true;
  const css = `
.tn-btn{font:var(--text-label);border-radius:var(--radius-sm);border:var(--border-w) solid transparent;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:8px;transition:background var(--duration-fast) var(--ease-standard),border-color var(--duration-fast) var(--ease-standard);white-space:nowrap}
.tn-btn:disabled{opacity:.4;cursor:not-allowed}
.tn-btn--sm{height:var(--control-h-sm);padding:0 12px;font-size:12px}
.tn-btn--md{height:var(--control-h-md);padding:0 16px}
.tn-btn--lg{height:var(--control-h-lg);padding:0 20px;font-size:15px}
.tn-btn--primary{background:var(--brand-primary);color:var(--text-on-primary)}
.tn-btn--primary:hover:not(:disabled){background:var(--brand-primary-hover)}
.tn-btn--primary:active:not(:disabled){background:var(--brand-primary-active)}
.tn-btn--secondary{background:var(--surface-card);color:var(--text-primary);border-color:var(--border-strong)}
.tn-btn--secondary:hover:not(:disabled){background:var(--gray-50);border-color:var(--color-steel-500)}
.tn-btn--ghost{background:transparent;color:var(--text-primary)}
.tn-btn--ghost:hover:not(:disabled){background:var(--gray-100)}
.tn-btn--danger{background:var(--color-error-500);color:#fff}
.tn-btn--danger:hover:not(:disabled){background:var(--color-error-600)}
`;
  const s = document.createElement("style");
  s.id = "tn-button-styles";
  s.textContent = css;
  document.head.appendChild(s);
}
function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  icon = null,
  children,
  onClick,
  type = "button"
}) {
  injectStyles();
  return React.createElement("button", {
    type,
    className: `tn-btn tn-btn--${variant} tn-btn--${size}`,
    disabled,
    onClick
  }, icon, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
let injected = false;
function injectStyles() {
  if (injected) return;
  injected = true;
  const css = `
.tn-iconbtn{display:inline-flex;align-items:center;justify-content:center;border-radius:var(--radius-sm);border:var(--border-w) solid transparent;background:transparent;color:var(--text-secondary);cursor:pointer;transition:background var(--duration-fast) var(--ease-standard),color var(--duration-fast) var(--ease-standard)}
.tn-iconbtn:hover:not(:disabled){background:var(--gray-100);color:var(--text-primary)}
.tn-iconbtn:disabled{opacity:.4;cursor:not-allowed}
.tn-iconbtn--sm{width:var(--control-h-sm);height:var(--control-h-sm)}
.tn-iconbtn--md{width:var(--control-h-md);height:var(--control-h-md)}
.tn-iconbtn--outline{border-color:var(--border-strong);background:var(--surface-card)}
`;
  const s = document.createElement("style");
  s.id = "tn-iconbutton-styles";
  s.textContent = css;
  document.head.appendChild(s);
}
function IconButton({
  size = "md",
  outline = false,
  disabled = false,
  children,
  onClick,
  label
}) {
  injectStyles();
  return React.createElement("button", {
    type: "button",
    className: `tn-iconbtn tn-iconbtn--${size} ${outline ? "tn-iconbtn--outline" : ""}`,
    disabled,
    onClick,
    "aria-label": label,
    title: label
  }, children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/data/Table.jsx
try { (() => {
let injected = false;
function injectStyles() {
  if (injected) return;
  injected = true;
  const css = `
.tn-table{width:100%;border-collapse:collapse;font:var(--text-body-md);color:var(--text-primary);background:var(--surface-card);border-radius:var(--radius-md);overflow:hidden;border:var(--border-w) solid var(--border-default)}
.tn-table thead th{text-align:left;font:var(--text-label);color:var(--text-secondary);background:var(--surface-sunken);padding:0 14px;height:36px;border-bottom:var(--border-w) solid var(--border-default)}
.tn-table td{padding:0 14px;height:var(--table-row-h);border-bottom:var(--border-w) solid var(--border-default);vertical-align:middle}
.tn-table tbody tr:last-child td{border-bottom:none}
.tn-table tbody tr:hover td{background:var(--surface-sunken)}
.tn-table--compact td{height:var(--table-row-h-compact)}
.tn-table td.tn-num{font:var(--text-numeric);text-align:right}
`;
  const s = document.createElement("style");
  s.id = "tn-table-styles";
  s.textContent = css;
  document.head.appendChild(s);
}
function Table({
  columns = [],
  rows = [],
  compact = false
}) {
  injectStyles();
  return React.createElement("table", {
    className: `tn-table ${compact ? "tn-table--compact" : ""}`
  }, React.createElement("thead", null, React.createElement("tr", null, columns.map(c => React.createElement("th", {
    key: c.key,
    style: c.align === "right" ? {
      textAlign: "right"
    } : undefined
  }, c.label)))), React.createElement("tbody", null, rows.map((r, i) => React.createElement("tr", {
    key: i
  }, columns.map(c => React.createElement("td", {
    key: c.key,
    className: c.numeric ? "tn-num" : undefined
  }, r[c.key]))))));
}
Object.assign(__ds_scope, { Table });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Table.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Badge.jsx
try { (() => {
let injected = false;
function injectStyles() {
  if (injected) return;
  injected = true;
  const css = `
.tn-badge{display:inline-flex;align-items:center;gap:4px;height:22px;padding:0 10px;border-radius:var(--radius-full);font:600 12px/1 var(--font-body);white-space:nowrap}
.tn-badge--neutral{background:var(--gray-100);color:var(--text-secondary)}
.tn-badge--primary{background:var(--color-primary-50);color:var(--color-primary-700)}
.tn-badge--success{background:var(--color-success-50);color:var(--color-success-600)}
.tn-badge--warning{background:var(--color-warning-50);color:var(--color-warning-600)}
.tn-badge--error{background:var(--color-error-50);color:var(--color-error-600)}
.tn-badge--info{background:var(--color-info-50);color:var(--color-info-600)}
.tn-tag{display:inline-flex;align-items:center;height:24px;padding:0 10px;border-radius:var(--radius-sm);background:var(--surface-sunken);border:var(--border-w) solid var(--border-default);font:var(--text-body-sm);color:var(--text-secondary)}
`;
  const s = document.createElement("style");
  s.id = "tn-badge-styles";
  s.textContent = css;
  document.head.appendChild(s);
}
function Badge({
  tone = "neutral",
  children
}) {
  injectStyles();
  return React.createElement("span", {
    className: `tn-badge tn-badge--${tone}`
  }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Badge.jsx", error: String((e && e.message) || e) }); }

// components/feedback/StatusBadge.jsx
try { (() => {
const STATUS_MAP = {
  borrador: {
    tone: "neutral",
    label: "Borrador"
  },
  enviado: {
    tone: "info",
    label: "Enviado"
  },
  pagado: {
    tone: "success",
    label: "Pagado"
  },
  vencido: {
    tone: "error",
    label: "Vencido"
  },
  pendiente: {
    tone: "warning",
    label: "Pendiente"
  }
};
function StatusBadge({
  status
}) {
  const m = STATUS_MAP[status] || STATUS_MAP.borrador;
  return React.createElement(__ds_scope.Badge, {
    tone: m.tone
  }, m.label);
}
Object.assign(__ds_scope, { StatusBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/StatusBadge.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tag.jsx
try { (() => {
function Tag({
  children
}) {
  const s = document.getElementById("tn-badge-styles");
  if (!s) {
    const st = document.createElement("style");
    st.id = "tn-badge-styles";
    st.textContent = ".tn-tag{display:inline-flex;align-items:center;height:24px;padding:0 10px;border-radius:var(--radius-sm);background:var(--surface-sunken);border:var(--border-w) solid var(--border-default);font:var(--text-body-sm);color:var(--text-secondary)}";
    document.head.appendChild(st);
  }
  return React.createElement("span", {
    className: "tn-tag"
  }, children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tag.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
let injected = false;
function injectStyles() {
  if (injected) return;
  injected = true;
  const css = `
.tn-toast{display:flex;align-items:center;gap:10px;min-width:280px;max-width:420px;padding:12px 14px;border-radius:var(--radius-md);background:var(--gray-900);color:var(--text-on-inverse);box-shadow:var(--shadow-lg);font:var(--text-body-sm)}
.tn-toast__bar{width:4px;align-self:stretch;border-radius:2px;flex-shrink:0}
.tn-toast--success .tn-toast__bar{background:var(--color-success-500)}
.tn-toast--error .tn-toast__bar{background:var(--color-error-500)}
.tn-toast--warning .tn-toast__bar{background:var(--color-warning-500)}
.tn-toast--info .tn-toast__bar{background:var(--color-info-500)}
`;
  const s = document.createElement("style");
  s.id = "tn-toast-styles";
  s.textContent = css;
  document.head.appendChild(s);
}
function Toast({
  tone = "info",
  children
}) {
  injectStyles();
  return React.createElement("div", {
    className: `tn-toast tn-toast--${tone}`
  }, React.createElement("span", {
    className: "tn-toast__bar"
  }), React.createElement("span", null, children));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
let injected = false;
function injectStyles() {
  if (injected) return;
  injected = true;
  const css = `
.tn-tooltip-wrap{position:relative;display:inline-flex}
.tn-tooltip{position:absolute;bottom:calc(100% + 6px);left:50%;transform:translateX(-50%);background:var(--gray-900);color:var(--text-on-inverse);font:var(--text-caption);padding:5px 9px;border-radius:var(--radius-xs);white-space:nowrap;opacity:0;pointer-events:none;transition:opacity var(--duration-fast)}
.tn-tooltip-wrap:hover .tn-tooltip{opacity:1}
`;
  const s = document.createElement("style");
  s.id = "tn-tooltip-styles";
  s.textContent = css;
  document.head.appendChild(s);
}
function Tooltip({
  label,
  children
}) {
  injectStyles();
  return React.createElement("span", {
    className: "tn-tooltip-wrap"
  }, children, React.createElement("span", {
    className: "tn-tooltip"
  }, label));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
let injected = false;
function injectStyles() {
  if (injected) return;
  injected = true;
  const css = `
.tn-check{display:inline-flex;align-items:center;gap:8px;cursor:pointer;font:var(--text-body-md);color:var(--text-primary);position:relative}
.tn-check input{position:absolute;opacity:0;width:18px;height:18px;margin:0;cursor:pointer}
.tn-check__box{width:18px;height:18px;border-radius:4px;border:var(--border-w-thick) solid var(--border-strong);background:var(--surface-card);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background var(--duration-fast),border-color var(--duration-fast)}
.tn-check input:checked ~ .tn-check__box{background:var(--brand-primary);border-color:var(--brand-primary)}
.tn-check input:disabled ~ .tn-check__box{opacity:.4}
`;
  const s = document.createElement("style");
  s.id = "tn-checkbox-styles";
  s.textContent = css;
  document.head.appendChild(s);
}
function Checkbox({
  label,
  checked,
  onChange,
  disabled
}) {
  injectStyles();
  return React.createElement("label", {
    className: "tn-check"
  }, React.createElement("input", {
    type: "checkbox",
    checked,
    onChange,
    disabled
  }), React.createElement("span", {
    className: "tn-check__box"
  }, checked && React.createElement("svg", {
    width: 12,
    height: 12,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: 3
  }, React.createElement("path", {
    d: "m5 13 4 4L19 7"
  }))), label);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
let injected = false;
function injectStyles() {
  if (injected) return;
  injected = true;
  const css = `
.tn-field{display:flex;flex-direction:column;gap:6px;font-family:var(--font-body)}
.tn-field__label{font:var(--text-label);color:var(--text-primary)}
.tn-field__hint{font:var(--text-caption);color:var(--text-muted)}
.tn-field__error{font:var(--text-caption);color:var(--color-error-500)}
.tn-input{height:var(--control-h-md);border-radius:var(--radius-sm);border:var(--border-w) solid var(--border-default);background:var(--surface-card);padding:0 12px;font:var(--text-body-md);color:var(--text-primary);width:100%}
.tn-input:focus{outline:none;border-color:var(--border-focus);box-shadow:0 0 0 3px rgba(187,76,31,.15)}
.tn-input::placeholder{color:var(--text-muted)}
.tn-input:disabled{background:var(--surface-sunken);opacity:.6;cursor:not-allowed}
.tn-input--sm{height:var(--control-h-sm);font-size:13px}
.tn-input--error{border-color:var(--color-error-500)}
.tn-input-wrap{position:relative;display:flex;align-items:center}
.tn-input-wrap .tn-input{padding-left:36px}
.tn-input-wrap__icon{position:absolute;left:10px;color:var(--text-muted);display:flex}
`;
  const s = document.createElement("style");
  s.id = "tn-input-styles";
  s.textContent = css;
  document.head.appendChild(s);
}
function Input({
  label,
  hint,
  error,
  size = "md",
  icon = null,
  ...rest
}) {
  injectStyles();
  const inputEl = icon ? React.createElement("div", {
    className: "tn-input-wrap"
  }, React.createElement("span", {
    className: "tn-input-wrap__icon"
  }, icon), React.createElement("input", {
    className: `tn-input tn-input--${size} ${error ? "tn-input--error" : ""}`,
    ...rest
  })) : React.createElement("input", {
    className: `tn-input tn-input--${size} ${error ? "tn-input--error" : ""}`,
    ...rest
  });
  return React.createElement("div", {
    className: "tn-field"
  }, label && React.createElement("label", {
    className: "tn-field__label"
  }, label), inputEl, error ? React.createElement("span", {
    className: "tn-field__error"
  }, error) : hint ? React.createElement("span", {
    className: "tn-field__hint"
  }, hint) : null);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
let injected = false;
function injectStyles() {
  if (injected) return;
  injected = true;
  const css = `
.tn-radio{display:inline-flex;align-items:center;gap:8px;cursor:pointer;font:var(--text-body-md);color:var(--text-primary);position:relative}
.tn-radio input{position:absolute;opacity:0;width:18px;height:18px;margin:0;cursor:pointer}
.tn-radio__dot{width:18px;height:18px;border-radius:50%;border:var(--border-w-thick) solid var(--border-strong);background:var(--surface-card);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.tn-radio__dot::after{content:"";width:9px;height:9px;border-radius:50%;background:var(--brand-primary);opacity:0;transition:opacity var(--duration-fast)}
.tn-radio input:checked ~ .tn-radio__dot{border-color:var(--brand-primary)}
.tn-radio input:checked ~ .tn-radio__dot::after{opacity:1}
`;
  const s = document.createElement("style");
  s.id = "tn-radio-styles";
  s.textContent = css;
  document.head.appendChild(s);
}
function Radio({
  label,
  checked,
  onChange,
  disabled,
  name
}) {
  injectStyles();
  return React.createElement("label", {
    className: "tn-radio"
  }, React.createElement("input", {
    type: "radio",
    checked,
    onChange,
    disabled,
    name
  }), React.createElement("span", {
    className: "tn-radio__dot"
  }), label);
}
Object.assign(__ds_scope, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
let injected = false;
function injectStyles() {
  if (injected) return;
  injected = true;
  const css = `
.tn-select{height:var(--control-h-md);border-radius:var(--radius-sm);border:var(--border-w) solid var(--border-default);background:var(--surface-card) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236a6155' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E") no-repeat right 10px center;padding:0 36px 0 12px;font:var(--text-body-md);color:var(--text-primary);width:100%;appearance:none;cursor:pointer}
.tn-select:focus{outline:none;border-color:var(--border-focus);box-shadow:0 0 0 3px rgba(187,76,31,.15)}
.tn-select:disabled{background-color:var(--surface-sunken);opacity:.6;cursor:not-allowed}
`;
  const s = document.createElement("style");
  s.id = "tn-select-styles";
  s.textContent = css;
  document.head.appendChild(s);
}
function Select({
  label,
  options = [],
  ...rest
}) {
  injectStyles();
  return React.createElement("div", {
    className: "tn-field"
  }, label && React.createElement("label", {
    className: "tn-field__label"
  }, label), React.createElement("select", {
    className: "tn-select",
    ...rest
  }, options.map(o => React.createElement("option", {
    key: o.value,
    value: o.value
  }, o.label))));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
let injected = false;
function injectStyles() {
  if (injected) return;
  injected = true;
  const css = `
.tn-switch{position:relative;display:inline-flex;align-items:center;width:40px;height:22px;cursor:pointer}
.tn-switch input{position:absolute;opacity:0;width:100%;height:100%;margin:0;cursor:pointer}
.tn-switch__track{position:absolute;inset:0;background:var(--gray-300);border-radius:var(--radius-full);transition:background var(--duration-fast)}
.tn-switch input:checked ~ .tn-switch__track{background:var(--brand-primary)}
.tn-switch input:disabled ~ .tn-switch__track{opacity:.4}
.tn-switch__thumb{position:absolute;top:2px;left:2px;width:18px;height:18px;border-radius:50%;background:#fff;box-shadow:var(--shadow-xs);transition:transform var(--duration-fast) var(--ease-standard)}
.tn-switch input:checked ~ .tn-switch__thumb{transform:translateX(18px)}
`;
  const s = document.createElement("style");
  s.id = "tn-switch-styles";
  s.textContent = css;
  document.head.appendChild(s);
}
function Switch({
  checked,
  onChange,
  disabled
}) {
  injectStyles();
  return React.createElement("label", {
    className: "tn-switch"
  }, React.createElement("input", {
    type: "checkbox",
    checked,
    onChange,
    disabled
  }), React.createElement("span", {
    className: "tn-switch__track"
  }), React.createElement("span", {
    className: "tn-switch__thumb"
  }));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
let injected = false;
function injectStyles() {
  if (injected) return;
  injected = true;
  const css = `
.tn-tabs{display:flex;gap:4px;border-bottom:var(--border-w) solid var(--border-default)}
.tn-tab{padding:10px 16px;font:var(--text-label);color:var(--text-secondary);cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px;background:none;border-left:none;border-right:none;border-top:none}
.tn-tab:hover{color:var(--text-primary)}
.tn-tab--active{color:var(--color-primary-600);border-bottom-color:var(--color-primary-500)}
`;
  const s = document.createElement("style");
  s.id = "tn-tabs-styles";
  s.textContent = css;
  document.head.appendChild(s);
}
function Tabs({
  items = [],
  active,
  onChange
}) {
  injectStyles();
  return React.createElement("div", {
    className: "tn-tabs"
  }, items.map(it => React.createElement("button", {
    key: it.value,
    type: "button",
    className: `tn-tab ${it.value === active ? "tn-tab--active" : ""}`,
    onClick: () => onChange && onChange(it.value)
  }, it.label)));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/overlay/Dialog.jsx
try { (() => {
let injected = false;
function injectStyles() {
  if (injected) return;
  injected = true;
  const css = `
.tn-dialog-scrim{position:absolute;inset:0;background:rgba(32,28,23,.5);display:flex;align-items:center;justify-content:center;z-index:50}
.tn-dialog{background:var(--surface-card);border-radius:var(--radius-lg);box-shadow:var(--shadow-lg);width:420px;max-width:90%;padding:24px;display:flex;flex-direction:column;gap:16}
.tn-dialog__title{font:var(--text-display-sm);color:var(--text-primary)}
.tn-dialog__body{font:var(--text-body-md);color:var(--text-secondary)}
.tn-dialog__actions{display:flex;justify-content:flex-end;gap:10px;margin-top:8px}
`;
  const s = document.createElement("style");
  s.id = "tn-dialog-styles";
  s.textContent = css;
  document.head.appendChild(s);
}
function Dialog({
  open = true,
  title,
  children,
  actions,
  onClose,
  relative = true
}) {
  injectStyles();
  if (!open) return null;
  return React.createElement("div", {
    className: "tn-dialog-scrim",
    style: relative ? {
      position: "absolute"
    } : {
      position: "fixed"
    },
    onClick: onClose
  }, React.createElement("div", {
    className: "tn-dialog",
    onClick: e => e.stopPropagation()
  }, title && React.createElement("div", {
    className: "tn-dialog__title"
  }, title), React.createElement("div", {
    className: "tn-dialog__body"
  }, children), actions && React.createElement("div", {
    className: "tn-dialog__actions"
  }, actions)));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/overlay/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Card.jsx
try { (() => {
let injected = false;
function injectStyles() {
  if (injected) return;
  injected = true;
  const css = `
.tn-card{background:var(--surface-card);border:var(--border-w) solid var(--border-default);border-radius:var(--radius-md);padding:20px;display:flex;flex-direction:column;gap:8px}
.tn-card--elevated{box-shadow:var(--shadow-sm);border-color:transparent}
.tn-card__title{font:var(--text-display-sm);color:var(--text-primary)}
.tn-card__body{font:var(--text-body-md);color:var(--text-secondary)}
`;
  const s = document.createElement("style");
  s.id = "tn-card-styles";
  s.textContent = css;
  document.head.appendChild(s);
}
function Card({
  title,
  elevated = false,
  children
}) {
  injectStyles();
  return React.createElement("div", {
    className: `tn-card ${elevated ? "tn-card--elevated" : ""}`
  }, title && React.createElement("div", {
    className: "tn-card__title"
  }, title), React.createElement("div", {
    className: "tn-card__body"
  }, children));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Card.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/InvoicesScreen.jsx
try { (() => {
function InvoicesScreen() {
  const {
    Card,
    StatusBadge,
    Table,
    Tabs
  } = window.TornerANanoDesignSystem_e2735b;
  const [tab, setTab] = React.useState("all");
  const rows = [{
    n: "A-0088",
    cliente: "Juan Pérez",
    fecha: "22/07/2026",
    total: "$ 34.500,00",
    status: "pagado"
  }, {
    n: "B-0087",
    cliente: "Taller del Sur",
    fecha: "20/07/2026",
    total: "$ 128.900,00",
    status: "pagado"
  }, {
    n: "B-0086",
    cliente: "María Gómez",
    fecha: "14/07/2026",
    total: "$ 9.200,00",
    status: "vencido"
  }];
  const cols = [{
    key: "n",
    label: "N.º"
  }, {
    key: "cliente",
    label: "Cliente"
  }, {
    key: "fecha",
    label: "Fecha"
  }, {
    key: "total",
    label: "Total",
    numeric: true
  }, {
    key: "status",
    label: "Estado"
  }];
  const tableRows = rows.map(r => ({
    n: r.n,
    cliente: r.cliente,
    fecha: r.fecha,
    total: r.total,
    status: React.createElement(StatusBadge, {
      status: r.status
    })
  }));
  return React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 20
    }
  }, React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 28,
      fontWeight: 600
    }
  }, "Facturación"), React.createElement("div", {
    style: {
      display: "flex",
      gap: 16
    }
  }, React.createElement(Card, {
    title: "Facturado este mes"
  }, "$ 172.600,00"), React.createElement(Card, {
    title: "Pendiente de cobro"
  }, "$ 9.200,00")), React.createElement(Tabs, {
    items: [{
      label: "Todas",
      value: "all"
    }, {
      label: "Pagadas",
      value: "pagado"
    }, {
      label: "Vencidas",
      value: "vencido"
    }],
    active: tab,
    onChange: setTab
  }), React.createElement(Table, {
    columns: cols,
    rows: tableRows.filter(r => tab === "all" || rows.find(x => x.n === r.n).status === tab)
  }));
}
window.InvoicesScreen = InvoicesScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/InvoicesScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/QuotesScreen.jsx
try { (() => {
function QuotesScreen() {
  const {
    Button,
    StatusBadge,
    Table,
    Dialog,
    Input,
    Select
  } = window.TornerANanoDesignSystem_e2735b;
  const [open, setOpen] = React.useState(false);
  const rows = [{
    n: "0412",
    cliente: "Juan Pérez",
    fecha: "22/07/2026",
    total: "$ 34.500,00",
    status: "enviado"
  }, {
    n: "0411",
    cliente: "Taller del Sur",
    fecha: "20/07/2026",
    total: "$ 128.900,00",
    status: "pagado"
  }, {
    n: "0410",
    cliente: "María Gómez",
    fecha: "14/07/2026",
    total: "$ 9.200,00",
    status: "vencido"
  }, {
    n: "0409",
    cliente: "Autopartes Beltrán",
    fecha: "09/07/2026",
    total: "$ 61.000,00",
    status: "borrador"
  }];
  const cols = [{
    key: "n",
    label: "N.º"
  }, {
    key: "cliente",
    label: "Cliente"
  }, {
    key: "fecha",
    label: "Fecha"
  }, {
    key: "total",
    label: "Total",
    numeric: true
  }, {
    key: "status",
    label: "Estado"
  }];
  const tableRows = rows.map(r => ({
    n: r.n,
    cliente: r.cliente,
    fecha: r.fecha,
    total: r.total,
    status: React.createElement(StatusBadge, {
      status: r.status
    })
  }));
  return React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 20
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-end"
    }
  }, React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 28,
      fontWeight: 600
    }
  }, "Presupuestos"), React.createElement(Button, {
    variant: "primary",
    onClick: () => setOpen(true)
  }, "Nuevo presupuesto")), React.createElement(Table, {
    columns: cols,
    rows: tableRows
  }), open && React.createElement(Dialog, {
    title: "Nuevo presupuesto",
    relative: true,
    onClose: () => setOpen(false),
    actions: React.createElement(React.Fragment, null, React.createElement(Button, {
      variant: "secondary",
      onClick: () => setOpen(false)
    }, "Cancelar"), React.createElement(Button, {
      variant: "primary",
      onClick: () => setOpen(false)
    }, "Guardar"))
  }, React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 14
    }
  }, React.createElement(Input, {
    label: "Cliente",
    placeholder: "Nombre del cliente"
  }), React.createElement(Select, {
    label: "Tipo de comprobante",
    options: [{
      label: "Factura A",
      value: "a"
    }, {
      label: "Factura B",
      value: "b"
    }, {
      label: "Presupuesto",
      value: "p"
    }]
  }), React.createElement(Input, {
    label: "Repuesto",
    placeholder: "Buscar repuesto..."
  }))));
}
window.QuotesScreen = QuotesScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/QuotesScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Sidebar.jsx
try { (() => {
const AppShellStyles = {
  sidebar: {
    width: 220,
    background: "var(--gray-900)",
    color: "var(--text-on-inverse)",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "20px 18px",
    borderBottom: "1px solid rgba(255,255,255,.08)"
  },
  navItem: active => ({
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "11px 18px",
    fontFamily: "var(--font-body)",
    fontWeight: 600,
    fontSize: 14,
    color: active ? "#fff" : "var(--gray-400)",
    background: active ? "var(--color-primary-600)" : "transparent",
    cursor: "pointer",
    borderLeft: active ? "3px solid var(--color-primary-300)" : "3px solid transparent"
  }),
  header: {
    height: 64,
    borderBottom: "1px solid var(--border-default)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
    flexShrink: 0,
    background: "var(--surface-card)"
  },
  main: {
    flex: 1,
    overflow: "auto",
    background: "var(--surface-page)",
    padding: 28
  }
};
function NavIcon({
  d
}) {
  return React.createElement("svg", {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2
  }, React.createElement("path", {
    d
  }));
}
function Sidebar({
  screen,
  setScreen
}) {
  const items = [{
    key: "stock",
    label: "Stock",
    d: "M21 8v13H3V8M1 3h22l-3 5H4L1 3ZM10 12h4"
  }, {
    key: "quotes",
    label: "Presupuestos",
    d: "M9 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6H9Z M9 2v6h6 M9 13h6M9 17h6"
  }, {
    key: "invoices",
    label: "Facturación",
    d: "M4 3h16v18l-4-2-4 2-4-2-4 2V3Z M8 8h8M8 12h8M8 16h5"
  }];
  return React.createElement("div", {
    style: AppShellStyles.sidebar
  }, React.createElement("div", {
    style: AppShellStyles.logoRow
  }, React.createElement("img", {
    src: "../../assets/isotype.svg",
    width: 28,
    height: 28
  }), React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      fontSize: 15,
      letterSpacing: ".02em"
    }
  }, "TORNERÍA NANO")), React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      marginTop: 8
    }
  }, items.map(it => React.createElement("div", {
    key: it.key,
    style: AppShellStyles.navItem(screen === it.key),
    onClick: () => setScreen(it.key)
  }, React.createElement(NavIcon, {
    d: it.d
  }), it.label))));
}
window.Sidebar = Sidebar;
window.AppShellStyles = AppShellStyles;
window.NavIcon = NavIcon;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Sidebar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/StockScreen.jsx
try { (() => {
function StockScreen() {
  const {
    Input,
    Button,
    Badge,
    Table,
    IconButton
  } = window.TornerANanoDesignSystem_e2735b;
  const [q, setQ] = React.useState("");
  const rows = [{
    name: "Rodamiento 6204-2RS",
    marca: "SKF",
    cat: "Rodamientos",
    qty: 12,
    min: 5,
    price: "$ 3.200,00"
  }, {
    name: "Retén de aceite 35x50x8",
    marca: "FAG",
    cat: "Hidráulica",
    qty: 3,
    min: 5,
    price: "$ 1.850,00"
  }, {
    name: "Correa trapezoidal A-52",
    marca: "Gates",
    cat: "Transmisión",
    qty: 7,
    min: 4,
    price: "$ 2.400,00"
  }, {
    name: "Buje de bronce 20x30",
    marca: "Nano",
    cat: "Torneado",
    qty: 20,
    min: 10,
    price: "$ 980,00"
  }, {
    name: "Rodamiento 6003-2Z",
    marca: "NTN",
    cat: "Rodamientos",
    qty: 0,
    min: 6,
    price: "$ 2.750,00"
  }];
  const filtered = rows.filter(r => r.name.toLowerCase().includes(q.toLowerCase()));
  const cols = [{
    key: "name",
    label: "Repuesto"
  }, {
    key: "marca",
    label: "Marca"
  }, {
    key: "cat",
    label: "Categoría"
  }, {
    key: "qty",
    label: "Stock",
    numeric: true
  }, {
    key: "price",
    label: "Precio",
    numeric: true
  }, {
    key: "actions",
    label: ""
  }];
  const tableRows = filtered.map(r => ({
    name: r.name,
    marca: r.marca,
    cat: r.cat,
    qty: React.createElement("span", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        justifyContent: "flex-end"
      }
    }, r.qty, r.qty === 0 ? React.createElement(Badge, {
      tone: "error"
    }, "Sin stock") : r.qty <= r.min ? React.createElement(Badge, {
      tone: "warning"
    }, "Bajo") : null),
    price: r.price,
    actions: React.createElement(IconButton, {
      label: "Editar"
    }, React.createElement(window.NavIcon, {
      d: "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"
    }))
  }));
  return React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 20
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-end"
    }
  }, React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 28,
      fontWeight: 600
    }
  }, "Stock de repuestos"), React.createElement(Button, {
    variant: "primary"
  }, "Agregar repuesto")), React.createElement("div", {
    style: {
      maxWidth: 320
    }
  }, React.createElement(Input, {
    placeholder: "Buscar repuesto...",
    value: q,
    onChange: e => setQ(e.target.value)
  })), React.createElement(Table, {
    columns: cols,
    rows: tableRows
  }));
}
window.StockScreen = StockScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/StockScreen.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Table = __ds_scope.Table;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.StatusBadge = __ds_scope.StatusBadge;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.Card = __ds_scope.Card;

})();
