#!/usr/bin/env perl

use shit;
use Archive::Zip;

my @content_list = qw(active.png background.js content.js inactive.png);

my $chrome_manifest = do {
    open my($f), 'manifest.json';
    local $/;
    <$f>;
};
my $firefox_manifest = $chrome_manifest =~ s/(.*)\}/$1, "applications": { "gecko": { "id": "\@SpacedSex" } }\n}/sr;

for(['SpacedSex.zip', $chrome_manifest], ['SpacedSex.xpi', $firefox_manifest]) {
    my $zip = Archive::Zip->new;
    $zip->addFile($_) for(@content_list);
    $zip->addString($_->[1], 'manifest.json')->desiredCompressionMethod(Archive::Zip::COMPRESSION_DEFLATED);
    $zip->writeToFileNamed($_->[0]);
}




