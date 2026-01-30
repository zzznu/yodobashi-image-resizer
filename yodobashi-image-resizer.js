// ==UserScript==
// @name         Yodobashi Image Resizer (Amazon Style)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  ヨドバシカメラの商品一覧画像をAmazonスタイルのサイズに調整して見やすくする（画像拡大・テキスト省略）
// @author       zzznu
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
        },
        // 商品カードの最小高さ
        cardMinHeight: '420px',
        // テキスト設定
        text: {
            productNameLines: 2,  // 商品名は2行まで
            descriptionLines: 2,  // 説明文は2行まで
            lineHeight: '1.4em'
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

        // 商品名のテキスト省略（2行まで）
        const productNames = document.querySelectorAll('.pName, .pListBlock .pName a');
        productNames.forEach(name => {
            Object.assign(name.style, {
                display: '-webkit-box',
                WebkitLineClamp: AMAZON_STYLE_CONFIG.text.productNameLines.toString(),
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: AMAZON_STYLE_CONFIG.text.lineHeight,
                maxHeight: `calc(${AMAZON_STYLE_CONFIG.text.lineHeight} * ${AMAZON_STYLE_CONFIG.text.productNameLines})`
            });
        });

        // 説明文のテキスト省略（2行まで）
        const descriptions = document.querySelectorAll('.pSpec, .pCatch, .productSpec');
        descriptions.forEach(desc => {
            Object.assign(desc.style, {
                display: '-webkit-box',
                WebkitLineClamp: AMAZON_STYLE_CONFIG.text.descriptionLines.toString(),
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: AMAZON_STYLE_CONFIG.text.lineHeight,
                maxHeight: `calc(${AMAZON_STYLE_CONFIG.text.lineHeight} * ${AMAZON_STYLE_CONFIG.text.descriptionLines})`
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