// ==UserScript==
// @name         Yodobashi Image Resizer (Amazon Style)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  ヨドバシカメラの商品一覧画像をAmazonスタイルのサイズに拡大して見やすくする
// @author       You
// @match        https://www.yodobashi.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    // Amazonスタイルの設定
    const AMAZON_STYLE_CONFIG = {
        // 商品一覧の画像（Amazonサイズ: 200x200程度）
        listImage: {
            maxWidth: '200px',
            maxHeight: '200px',
            objectFit: 'contain'
        }
    };

    // スタイルを適用する関数
    function applyImageStyles() {
        // 商品一覧のカード全体を調整（pListBlock）
        const productCards = document.querySelectorAll('.pListBlock');
        productCards.forEach(card => {
            Object.assign(card.style, {
                display: 'flex',
                flexDirection: 'column'
            });
        });

        // 商品一覧の画像コンテナを調整
        const imageContainers = document.querySelectorAll('.pImg, .pListBlock .pImg');
        imageContainers.forEach(container => {
            Object.assign(container.style, {
                minHeight: '220px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '10px'
            });
        });

        // 商品一覧ページの画像（pImgurl内のimg）
        const listImages = document.querySelectorAll('.pImgurl img, .pImg img');
        listImages.forEach(img => {
            Object.assign(img.style, {
                maxWidth: AMAZON_STYLE_CONFIG.listImage.maxWidth,
                maxHeight: AMAZON_STYLE_CONFIG.listImage.maxHeight,
                objectFit: AMAZON_STYLE_CONFIG.listImage.objectFit,
                width: 'auto',
                height: 'auto',
                display: 'block',
                margin: '0 auto'
            });
        });

        // テキスト部分（pName, pInfo等）のスペースを確保
        const textContainers = document.querySelectorAll('.pName, .pInfo');
        textContainers.forEach(container => {
            Object.assign(container.style, {
                marginTop: '8px'
            });
        });
    }

    // 初回実行
    applyImageStyles();

    // 画像の遅延読み込みに対応するため、MutationObserverで監視
    const observer = new MutationObserver((mutations) => {
        let shouldReapply = false;
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) { // Element node
                    if (node.tagName === 'IMG' || node.querySelector('img')) {
                        shouldReapply = true;
                    }
                }
            });
        });
        if (shouldReapply) {
            setTimeout(applyImageStyles, 100);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // ページ読み込み完了後にも実行
    window.addEventListener('load', () => {
        setTimeout(applyImageStyles, 500);
    });

    console.log('Yodobashi Image Resizer (Amazon Style) が有効化されました');
})();