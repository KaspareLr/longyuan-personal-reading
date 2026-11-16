(()=>{
 const root=document.querySelector('#view-books');if(!root)return;
 const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const filters=['全部',...new Set(libraryBooks.map(book=>book.category))];
 const category=b=>b.category;
 const library=document.createElement('section');library.className='books-library';library.setAttribute('aria-label','全部图书');
 root.querySelectorAll(':scope > .content').forEach(node=>node.remove());root.append(library);
 library.innerHTML=`<header class="books-library-heading"><div><span>ALL BOOKS</span><h2>全部图书</h2></div><div class="books-library-filters" aria-label="图书分类">${filters.map((name,i)=>`<button type="button" data-library-filter="${name}" aria-pressed="${i===0}">${name}</button>`).join('')}</div></header><div class="books-library-grid"></div><p class="books-library-empty" role="status" hidden>这个分类暂未收录图书。</p>`;
 function render(filter='全部'){
 const books=libraryBooks.filter(book=>filter==='全部'||category(book)===filter);
 library.querySelector('.books-library-grid').innerHTML=books.map(book=>`<a class="books-library-card" href="${e(book.url)}"><div class="books-library-cover-area"><span class="books-library-volume"><span class="books-library-paper" aria-hidden="true"></span><img class="books-library-cover" src="${e(book.cover)}" alt="《${e(book.title)}》封面" loading="lazy"></span></div><div class="books-library-info"><h3>${e(book.title)}</h3><p>${e([book.publisher||book.author,book.chapters?book.chapters+'章':''].filter(Boolean).join(' · '))}</p></div><footer><span>${e(book.category)}</span><span class="books-library-arrow" aria-hidden="true"><img src="assets/figma-books/library-arrow.svg" alt=""></span></footer></a>`).join('');
 library.querySelector('.books-library-empty').hidden=books.length>0;
 library.querySelectorAll('[data-library-filter]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.libraryFilter===filter)));
 }
 library.addEventListener('click',event=>{const button=event.target.closest('[data-library-filter]');if(button)render(button.dataset.libraryFilter);});render();
})();
