// CONFIGURAÇÃO DO HEADER
const Header = () => {
    return ( 
        <header className="container-fluid d-flex justify-content-end">
            <div className="d-flex align-items-center">
                <div>
                    <span className="d-block m-0 p-0 text-white">Oficina do Corte</span>
                    <small className="m-0 p-0">Plano Gold</small>
                </div>
                <img alt="Logo" src="https://img.freepik.com/fotos-premium/sorriso-de-retrato-e-homem-com-confianca-positiva-e-despreocupado-contra-um-fundo-de-estudio-cinza-enfrentar-pessoa-do-sexo-masculino-e-humano-com-uma-atitude-alegre-liberdade-e-modelo-com-alegria-canada-e-relaxar_590464-177008.jpg"/>
                <span className="mdi mdi-chevron-down text-white"></span>
            </div>
        </header>
    );
};

export default Header;