let model;
let encoder;

async function loadModel() {
    model = await tf.loadLayersModel('/models/theme_model/model.json');
    encoder = await use.load();
}

async function predictTheme(input) {
    const embeddings = await encoder.embed(input);
    const prediction = await model.predict(embeddings).data();
    const themeIndex = prediction.indexOf(Math.max(...prediction));
    const themes = ['ocean', 'sunset', 'forest', 'night', 'desert'];
    return themes[themeIndex];
}

loadModel();