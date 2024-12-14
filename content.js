async function parseAudio() {
    const scripts = document.querySelectorAll("script");
    let dataContent;

    for (const script of scripts) {
        if (script.textContent.includes('const data =')) {
            dataContent = script.textContent;
            break;
        }
    }

    if (dataContent) {
        const dataMatch = dataContent.match(/const data = (\[.*?\]);/s);
        if (dataMatch) {
            let diffusionIdMatch = dataMatch[1].match(/diffusionId\s*:\s*([^,]+)/);

            if(!diffusionIdMatch) 
                diffusionIdMatch = dataMatch[1].match(/id_diffusion\s*:\s*([^,]+)/)

            if (diffusionIdMatch) {
                const parsed = JSON.parse(`{"diffusionId" : ${diffusionIdMatch[1]}}`).diffusionId

                const resp = await fetch('https://www.radiofrance.fr/api/expressions?variant=horizontal&limit=1&ids=' + parsed);
                
                if(resp.ok) {
                    const data = await resp.json();
                    const manifestations = data.items[0].manifestations;
                    console.log(manifestations);
                    let ctaDiv = document.querySelector('.CoverEpisode-cta');
                    if(!ctaDiv)
                        ctaDiv = document.querySelector('.CoverPodcast-cta');
                    if (ctaDiv) {
                        manifestations.forEach(manifestation => {
                            const button = document.createElement('button');
                            button.classList.add('Button', 'light', 'primary', 'large', 'svelte-1weqwpy');
                            button.innerHTML = `<span slot="extra-content"><div style="display: inline-flex;">${manifestation.title} ${manifestation.preset.encoding}</div></span>`;
                            button.addEventListener('click', () => {
                                window.open(manifestation.url, '_blank');
                            });
                            ctaDiv.appendChild(button);
                        });
                    }
                }

            } else {
                console.log("nor 'diffusionId'.");
            }
        } else {
            console.error("no data");
        }
    } else {
        console.error("no script");
    }

}
setTimeout(() => {
    parseAudio();
}, 200);