
public class Summernote
{
    public Summernote(string iDEditor, bool loadLibrary = true)
    {
        IDEditor = iDEditor;
        LoadLibrary = loadLibrary;
    }

    public string IDEditor { get; set; }

    public bool LoadLibrary { get; set; }

    public int height { get; set; } = 300;

    public string toolbar { get; set; } = @"
            [
                ['style', ['style']],
                ['font', ['bold', 'underline', 'clear']],
                ['fontsize', ['fontsize']],
                ['color', ['color']],
                ['para', ['paragraph']],
                ['table', ['table']],
                ['insert', ['link','video', 'elfinder']],
                ['height', ['height']],
                ['view', ['fullscreen', 'codeview', 'help']]
            ]       
        ";
}
