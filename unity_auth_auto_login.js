// ==UserScript==
// @name         unity_auth_auto_login
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动填充用户名/密码，并延迟点击登录
// @author       You
// @match        *://login.xjtu.edu.cn/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    /* ===== 1. 这里换成你自己的账号 ===== */
    const USERNAME = 'username';
    const PASSWORD = 'pwd';

    /* ===== 2. 等待节点出现 ===== */
    function waitFor(selector, timeout = 5e3) {
        return new Promise((resolve, reject) => {
            const tick = () => {
                const el = document.querySelector(selector);
                if (el) return resolve(el);
                if ((timeout -= 100) < 0) return reject(new Error(selector + ' 超时'));
                setTimeout(tick, 100);
            };
            tick();
        });
    }

    /* ===== 3. 主流程 ===== */
    async function autoFill() {
        try {
            // 3-1 用户名输入框
            const userInput = await waitFor('input[placeholder*="职工号"],input[placeholder*="学号"],input[placeholder*="手机号"]');
            userInput.focus();
            userInput.value = USERNAME;
            userInput.dispatchEvent(new Event('input', { bubbles: true }));   // 触发 v-model 同步

            // 3-2 密码输入框
            const pwdInput = await waitFor('input[type="password"]');
            pwdInput.focus();
            pwdInput.value = PASSWORD;
            pwdInput.dispatchEvent(new Event('input', { bubbles: true }));

            // 3-3 可选：把密码框改成 text，方便肉眼确认
            // pwdInput.type = 'text';

            // 3-4 延迟点击登录
            setTimeout(() => {
                const loginBtn = document.querySelector('button.login-btn');
                if (loginBtn) loginBtn.click();
            }, 5000);
        } catch (e) {
            console.error('[AutoLogin]', e);
        }
    }

    // 页面加载完再执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', autoFill);
    } else {
        autoFill();
    }
})();